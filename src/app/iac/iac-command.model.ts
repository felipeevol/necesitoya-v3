export type CommandGroup = 'keyPair' | 'instanceIp' | 'loadBalancerAccess' | 'keyPairIp' | 'stopInstance';
export type CommandPlatform = 'windows' | 'bash';

const keyPairCommands = {
  windows: `$KeyId = aws ec2 describe-key-pairs \`
  --key-names minha-key-for-launch-template \`
  --query "KeyPairs[0].KeyPairId" \`
  --output text

aws ssm get-parameter \`
  --name "/ec2/keypair/$KeyId" \`
  --with-decryption \`
  --query "Parameter.Value" \`
  --output text | Set-Content -NoNewline -Encoding ascii minha-key-for-launch-template.ppk`,
  bash: `export MSYS_NO_PATHCONV=1

KEY_ID=$(aws ec2 describe-key-pairs \\
  --key-names minha-key-for-launch-template \\
  --query "KeyPairs[0].KeyPairId" \\
  --output text)

aws ssm get-parameter \\
  --name "/ec2/keypair/$KEY_ID" \\
  --with-decryption \\
  --query "Parameter.Value" \\
  --output text > minha-key-for-launch-template.pem`,
} as const;

const instanceIpCommands = {
  windows: `aws ec2 describe-instances \`
  --filters \`
  "Name=tag:Name,Values=MyAutoScalingGroup" \`
  "Name=instance-state-name,Values=running" \`
  --query "Reservations[].Instances[].{InstanceId:InstanceId,PublicIP:PublicIpAddress}" \`
  --output table`,
  bash: `aws ec2 describe-instances \\
  --filters \\
    "Name=tag:Name,Values=MyAutoScalingGroup" \\
    "Name=instance-state-name,Values=running" \\
  --query "Reservations[].Instances[].{InstanceId:InstanceId,PublicIP:PublicIpAddress}" \\
  --output table`,
} as const;

const loadBalancerAccessCommands = {
  windows: `$dns = aws elbv2 describe-load-balancers --names my-alb --query "LoadBalancers[0].DNSName" --output text
"http://$dns"`,
  bash: `echo "http://$(aws elbv2 describe-load-balancers \\
  --names my-alb \\
  --query 'LoadBalancers[0].DNSName' \\
  --output text)"`,
} as const;

const stopInstanceCommands = {
  windows: `$InstanceId = "<InstanceId>"

aws ec2 stop-instances \`
  --instance-ids $InstanceId`,
  bash: `aws ec2 stop-instances --instance-ids <InstanceId>`,
} as const;

const keyPairIpCommands = `sudo su
sudo dnf update -y
sudo dnf install stress -y
stress --cpu 2 --timeout 300s`;

export function getIacCommand(group: CommandGroup, platform: CommandPlatform): string {
  if (group === 'keyPair') {
    return keyPairCommands[platform];
  }

  if (group === 'instanceIp') {
    return instanceIpCommands[platform];
  }

  if (group === 'loadBalancerAccess') {
    return loadBalancerAccessCommands[platform];
  }

  if (group === 'stopInstance') {
    return stopInstanceCommands[platform];
  }

  return keyPairIpCommands;
}
