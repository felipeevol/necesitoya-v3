#!/bin/bash -ex

labUrlPrefix=$1
labName=$2
winip=$3
winpassword=$4

sudo su -
dnf install -y python3 python3-pip

cd /home/ec2-user
pip install filechunkio boto3
yum install -y java-1.8.0-openjdk java-1.8.0-openjdk-devel
echo 'JAVA_HOME=/usr' >> /home/ec2-user/.bash_profile
echo 'export JAVA_HOME' >> /home/ec2-user/.bash_profile
export JAVA_HOME=/usr

LAB_DOWNLOAD=https://aws-tc-largeobjects.s3.amazonaws.com/AWS-100-DEV/v3.0

wget ${LAB_DOWNLOAD}/binaries/packages/apache-ant-1.10.3-bin.zip
unzip -q apache-ant-1.10.3-bin.zip
chown -R ec2-user:ec2-user apache-ant-1.10.3
echo 'PATH=$PATH:/home/ec2-user/apache-ant-1.10.3/bin' >> /home/ec2-user/.bash_profile
echo 'ANT_HOME=/home/ec2-user/apache-ant-1.10.3' >> /home/ec2-user/.bash_profile
echo 'export ANT_HOME' >> /home/ec2-user/.bash_profile

skeletonName="${labName}"
UnableToCreateWorkdir="ERROR: Unable to create workdir"
UnableToDownloadFile="ERROR: Unable to download file:"
UnableToSetUpLabSkeleton="ERROR: Unable to set up lab skeleton code"
CompletedLabSkeletonSetup="Completed lab skeleton setup in directory:"

workdir=workdir
skeletonNameZip=$skeletonName.zip
if [ ! -d "$workdir" ]; then
  mkdir $workdir
  if [ ! -d "$workdir" ]; then
    echo "$UnableToCreateWorkdir",
    exit 1;
  fi
fi

LAB_DOWNLOAD_SKEL=${LAB_DOWNLOAD}/$skeletonNameZip

cd workdir
curl -O $LAB_DOWNLOAD_SKEL
if [ ! -e $skeletonNameZip ]; then
  echo "$UnableToDownloadFile $LAB_DOWNLOAD"
  exit 1;
fi

unzip -q $skeletonNameZip

cd ..
chown -R ec2-user:ec2-user $workdir

echo "$CompletedLabSkeletonSetup $labDirectoryName"
