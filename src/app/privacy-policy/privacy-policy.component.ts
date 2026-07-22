import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Locale } from '../shared/site-translations';

type PolicySection = {
  title: string;
  paragraphs: string[];
  items?: string[];
  emailLabel?: string;
};

type PolicyContent = {
  title: string;
  subtitle: string;
  updatedAtLabel: string;
  updatedAtValue: string;
  backToHome: string;
  sections: PolicySection[];
};

const policyContent: Record<Locale, PolicyContent> = {
  pt: {
    title: 'Política de Privacidade',
    subtitle: 'Explicamos como recolhemos, utilizamos e protegemos os seus dados pessoais neste website.',
    updatedAtLabel: 'Última atualização',
    updatedAtValue: '22 de julho de 2026',
    backToHome: 'Voltar à página principal',
    sections: [
      {
        title: '1. Introdução',
        paragraphs: [
          'A sua privacidade é importante para nós. Esta Política de Privacidade explica como recolhemos, utilizamos e protegemos os seus dados pessoais quando utiliza este website.',
        ],
      },
      {
        title: '2. Que dados recolhemos?',
        paragraphs: [
          'Quando utiliza o formulário de contacto, podemos recolher os seguintes dados:',
        ],
        items: [
          'Nome',
          'Endereço de e-mail',
          'Qualquer informação adicional que decida incluir na sua mensagem',
        ],
      },
      {
        title: '3. Para que utilizamos os seus dados?',
        paragraphs: [
          'Os dados recolhidos são utilizados exclusivamente para:',
          'Não utilizamos os seus dados para marketing sem o seu consentimento.',
        ],
        items: [
          'Responder às suas perguntas ou pedidos.',
          'Comunicar consigo relativamente ao assunto do seu contacto.',
        ],
      },
      {
        title: '4. Base legal para o tratamento',
        paragraphs: [
          'Tratamos os seus dados com base no seu consentimento ao submeter o formulário de contacto e/ou porque o tratamento é necessário para responder ao seu pedido.',
        ],
      },
      {
        title: '5. Durante quanto tempo conservamos os dados?',
        paragraphs: [
          'Os seus dados serão conservados apenas durante o tempo necessário para responder ao seu pedido ou cumprir obrigações legais aplicáveis.',
        ],
      },
      {
        title: '6. Partilha de dados',
        paragraphs: [
          'Os seus dados não são vendidos nem cedidos a terceiros para fins comerciais.',
          'Poderão ser tratados por fornecedores de serviços tecnológicos que suportam o funcionamento deste website (por exemplo, alojamento ou envio de e-mails), sempre em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).',
        ],
      },
      {
        title: '7. Segurança',
        paragraphs: [
          'Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados contra acesso não autorizado, perda, alteração ou divulgação.',
        ],
      },
      {
        title: '8. Os seus direitos',
        paragraphs: [
          'Nos termos do RGPD, tem o direito de:',
          'Para exercer qualquer destes direitos, contacte-nos através do endereço indicado abaixo.',
        ],
        items: [
          'Aceder aos seus dados pessoais.',
          'Solicitar a retificação de dados incorretos.',
          'Solicitar o apagamento dos seus dados.',
          'Solicitar a limitação do tratamento.',
          'Opor-se ao tratamento dos seus dados.',
          'Solicitar a portabilidade dos dados, quando aplicável.',
          'Retirar o consentimento a qualquer momento, sem afetar a licitude do tratamento realizado anteriormente.',
        ],
      },
      {
        title: '9. Contacto',
        paragraphs: [
          'Se tiver alguma questão sobre esta Política de Privacidade ou sobre o tratamento dos seus dados pessoais, pode contactar-nos através de:',
        ],
        emailLabel: 'E-mail',
      },
      {
        title: '10. Alterações a esta política',
        paragraphs: [
          'Reservamo-nos o direito de atualizar esta Política de Privacidade sempre que necessário. A versão mais recente estará sempre disponível nesta página.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    subtitle: 'We explain how we collect, use, and protect your personal data on this website.',
    updatedAtLabel: 'Last updated',
    updatedAtValue: 'July 22, 2026',
    backToHome: 'Back to the main page',
    sections: [
      {
        title: '1. Introduction',
        paragraphs: [
          'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data when you use this website.',
        ],
      },
      {
        title: '2. What data do we collect?',
        paragraphs: [
          'When you use the contact form, we may collect the following data:',
        ],
        items: [
          'Name',
          'Email address',
          'Any additional information you choose to include in your message',
        ],
      },
      {
        title: '3. How do we use your data?',
        paragraphs: [
          'The data collected is used exclusively to:',
          'We do not use your data for marketing without your consent.',
        ],
        items: [
          'Respond to your questions or requests.',
          'Communicate with you about your inquiry.',
        ],
      },
      {
        title: '4. Legal basis for processing',
        paragraphs: [
          'We process your data based on your consent when submitting the contact form and/or because the processing is necessary to respond to your request.',
        ],
      },
      {
        title: '5. How long do we retain your data?',
        paragraphs: [
          'Your data will only be kept for as long as necessary to respond to your request or comply with applicable legal obligations.',
        ],
      },
      {
        title: '6. Data sharing',
        paragraphs: [
          'Your data is not sold or shared with third parties for commercial purposes.',
          'It may be processed by technology service providers that support the operation of this website (for example, hosting or email services), always in compliance with the General Data Protection Regulation (GDPR).',
        ],
      },
      {
        title: '7. Security',
        paragraphs: [
          'We adopt appropriate technical and organizational measures to protect your data against unauthorized access, loss, alteration, or disclosure.',
        ],
      },
      {
        title: '8. Your rights',
        paragraphs: [
          'Under the GDPR, you have the right to:',
          'To exercise any of these rights, please contact us using the address below.',
        ],
        items: [
          'Access your personal data.',
          'Request the correction of inaccurate data.',
          'Request the deletion of your data.',
          'Request restriction of processing.',
          'Object to the processing of your data.',
          'Request data portability where applicable.',
          'Withdraw your consent at any time, without affecting the lawfulness of processing carried out before withdrawal.',
        ],
      },
      {
        title: '9. Contact',
        paragraphs: [
          'If you have any questions about this Privacy Policy or the processing of your personal data, you can contact us via:',
        ],
        emailLabel: 'Email',
      },
      {
        title: '10. Changes to this policy',
        paragraphs: [
          'We reserve the right to update this Privacy Policy whenever necessary. The latest version will always be available on this page.',
        ],
      },
    ],
  },
  es: {
    title: 'Política de Privacidad',
    subtitle: 'Explicamos cómo recopilamos, utilizamos y protegemos tus datos personales en este sitio web.',
    updatedAtLabel: 'Última actualización',
    updatedAtValue: '22 de julio de 2026',
    backToHome: 'Volver a la página principal',
    sections: [
      {
        title: '1. Introducción',
        paragraphs: [
          'Tu privacidad es importante para nosotros. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos tus datos personales cuando usas este sitio web.',
        ],
      },
      {
        title: '2. ¿Qué datos recopilamos?',
        paragraphs: [
          'Cuando utilizas el formulario de contacto, podemos recopilar los siguientes datos:',
        ],
        items: [
          'Nombre',
          'Dirección de correo electrónico',
          'Cualquier información adicional que decidas incluir en tu mensaje',
        ],
      },
      {
        title: '3. ¿Para qué utilizamos tus datos?',
        paragraphs: [
          'Los datos recopilados se utilizan exclusivamente para:',
          'No utilizamos tus datos con fines de marketing sin tu consentimiento.',
        ],
        items: [
          'Responder a tus preguntas o solicitudes.',
          'Comunicarnos contigo sobre el asunto de tu contacto.',
        ],
      },
      {
        title: '4. Base legal para el tratamiento',
        paragraphs: [
          'Tratamos tus datos con base en tu consentimiento al enviar el formulario de contacto y/o porque el tratamiento es necesario para responder a tu solicitud.',
        ],
      },
      {
        title: '5. ¿Durante cuánto tiempo conservamos los datos?',
        paragraphs: [
          'Tus datos solo se conservarán durante el tiempo necesario para responder a tu solicitud o cumplir con las obligaciones legales aplicables.',
        ],
      },
      {
        title: '6. Cesión de datos',
        paragraphs: [
          'Tus datos no se venden ni se ceden a terceros con fines comerciales.',
          'Pueden ser tratados por proveedores de servicios tecnológicos que apoyan el funcionamiento de este sitio web (por ejemplo, alojamiento o envío de correos electrónicos), siempre de conformidad con el Reglamento General de Protección de Datos (RGPD).',
        ],
      },
      {
        title: '7. Seguridad',
        paragraphs: [
          'Adoptamos medidas técnicas y organizativas adecuadas para proteger tus datos contra accesos no autorizados, pérdida, alteración o divulgación.',
        ],
      },
      {
        title: '8. Tus derechos',
        paragraphs: [
          'De acuerdo con el RGPD, tienes derecho a:',
          'Para ejercer cualquiera de estos derechos, contáctanos mediante la dirección indicada a continuación.',
        ],
        items: [
          'Acceder a tus datos personales.',
          'Solicitar la rectificación de datos incorrectos.',
          'Solicitar la eliminación de tus datos.',
          'Solicitar la limitación del tratamiento.',
          'Oponerte al tratamiento de tus datos.',
          'Solicitar la portabilidad de los datos, cuando corresponda.',
          'Retirar tu consentimiento en cualquier momento, sin afectar a la licitud del tratamiento realizado anteriormente.',
        ],
      },
      {
        title: '9. Contacto',
        paragraphs: [
          'Si tienes alguna pregunta sobre esta Política de Privacidad o sobre el tratamiento de tus datos personales, puedes contactarnos a través de:',
        ],
        emailLabel: 'Correo electrónico',
      },
      {
        title: '10. Cambios en esta política',
        paragraphs: [
          'Nos reservamos el derecho de actualizar esta Política de Privacidad siempre que sea necesario. La versión más reciente estará siempre disponible en esta página.',
        ],
      },
    ],
  },
};

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
})
export class PrivacyPolicyComponent {
  private readonly language = inject(SiteLanguageService);

  get currentLocale(): Locale {
    return this.language.currentLocale();
  }

  get currentPolicy(): PolicyContent {
    return policyContent[this.currentLocale];
  }
}
