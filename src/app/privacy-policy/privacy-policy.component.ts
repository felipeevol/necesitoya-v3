import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteLanguageService } from '../shared/site-language.service';
import { Locale } from '../shared/site-translations';

type PolicySection = {
  title: string;
  paragraphs: string[];
  items?: string[];
  afterItemsParagraphs?: {
    text: string;
    label: string;
    url: string;
    punctuation?: string;
  }[];
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
        title: '2. Para que utilizamos os seus dados?',
        paragraphs: [
          'Através do formulário de contacto na nossa página principal, podemos recolher o seu nome, endereço de e-mail e qualquer informação adicional que decida incluir na sua mensagem. Utilizamos estas informações apenas para responder às suas perguntas ou pedidos e acompanhar a sua consulta. Não as utilizamos para marketing sem o seu consentimento.',
        ],
        afterItemsParagraphs: [
          {
            text: 'Na página Java Versions, podemos recolher o seu endereço de e-mail através do formulário de subscrição e armazenamo-lo no Brevo, a plataforma de e-mail que utilizamos para gerir subscrições e enviar atualizações. Com o seu consentimento, utilizamos o seu endereço de e-mail apenas para lhe enviar atualizações sobre o diagrama Java Versions. Pode cancelar a subscrição a qualquer momento',
            label: 'cancelar subscrição',
            url: 'https://be4394eb.sibforms.com/serve/MUIFACnPUyiDWFB5QRb7P05ebqLOIRYdvu45xwF2rkW023Ms0tYEf6x2Cww4q4pe7F14gF4Syuq6aVKqRhxt3kXDbv9yvUSwBXKkBNMDRhj3iC4keOwLkSjf0L8l9EXlKLYJ5_DRkML6TM9BOvc0O-NSdOTOPiqVHrxva3SbhYzfCPeWxnLr4NVadlEPKeEI0yNoyI9Wk12qHr769Q==',
            punctuation: '.',
          },
          {
            text: 'Na página IaC Examples, podemos recolher o seu endereço de e-mail através do formulário de subscrição e armazenamo-lo no Brevo, a plataforma de e-mail que utilizamos para gerir subscrições e enviar atualizações. Com o seu consentimento, utilizamos o seu endereço de e-mail apenas para lhe enviar atualizações do IaC Examples. Pode cancelar a subscrição a qualquer momento',
            label: 'cancelar subscrição',
            url: 'https://be4394eb.sibforms.com/serve/MUIFAI0T2W-wx7MBXFvKN3MDWQMmI3IVIhe7BmyHJTFAprVwdja4wOZJfqF7_yHn8D-lA3iDLCDABqvgHhIZPm71FDpQGkwHtihYf9CeJwFk5kpozDk2FXvm06kzLifg3YE-Nz8f7Lduexkeo1i24WYjAdTyXwi73nv9WR-m67T8O3P4-sP269BRT3D5yTiIsRAKvqSrAc7YV2aADQ==',
            punctuation: '.',
          },
        ],
      },
      {
        title: '3. Base legal para o tratamento',
        paragraphs: [
          'Tratamos os seus dados com base no seu consentimento ao submeter o formulário de contacto e/ou porque o tratamento é necessário para responder ao seu pedido.',
        ],
      },
      {
        title: '4. Durante quanto tempo conservamos os dados?',
        paragraphs: [
          'Os seus dados serão conservados apenas durante o tempo necessário para responder ao seu pedido ou cumprir obrigações legais aplicáveis.',
        ],
      },
      {
        title: '5. Partilha de dados',
        paragraphs: [
          'Os seus dados não são vendidos nem cedidos a terceiros para fins comerciais.',
          'Poderão ser tratados por fornecedores de serviços tecnológicos que suportam o funcionamento deste website (por exemplo, alojamento ou envio de e-mails), sempre em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD).',
        ],
      },
      {
        title: '6. Segurança',
        paragraphs: [
          'Adotamos medidas técnicas e organizativas adequadas para proteger os seus dados contra acesso não autorizado, perda, alteração ou divulgação.',
        ],
      },
      {
        title: '7. Os seus direitos',
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
        title: '8. Contacto',
        paragraphs: [
          'Se tiver alguma questão sobre esta Política de Privacidade ou sobre o tratamento dos seus dados pessoais, pode contactar-nos através de:',
        ],
        emailLabel: 'E-mail',
      },
      {
        title: '9. Alterações a esta política',
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
        title: '2. How do we use your data?',
        paragraphs: [
          'Through the contact form on our main page, we may collect your name, email address, and any additional information you choose to include in your message. We use this information only to respond to your questions or requests and follow up on your inquiry. We do not use it for marketing without your consent.',
        ],
        afterItemsParagraphs: [
          {
            text: 'On the Java Versions page, we may collect your email address through the subscription form and store it in Brevo, the email platform we use to manage subscriptions and send updates. With your consent, we use your email address only to send you updates about the Java Versions diagram. You can unsubscribe at any time',
            label: 'unsubscribe',
            url: 'https://be4394eb.sibforms.com/serve/MUIFANum5nXgC0hIKyUHAF6cHfDmks0kXQxIKwC8vRO81_meXQCHPtV5kD6-pJvNfDpyvdbOdr0KnZmIYeic5t7sdj2lEY_DdyVFsguNUKZ1wO1sjblyhc2QtZ1cnL_GRXuPLnq1EFyQbumPLSEMJtRVzjATydZMyZlgbGlpM6UPITynKVStEuuZtycwGnuKW6i1xq4-S2yGKo3KIw==',
            punctuation: '.',
          },
          {
            text: 'On the IaC Examples page, we may collect your email address through the subscription form and store it in Brevo, the email platform we use to manage subscriptions and send updates. With your consent, we use your email address only to send you updates about IaC Examples. You can unsubscribe at any time',
            label: 'unsubscribe',
            url: 'https://be4394eb.sibforms.com/serve/MUIFAOxlmTLodKOfWtsGy8KWcIhFhYpVxe6GxySXkUVpiYIYcyqXuLAnoKKG8DFo8-Q0II2yZVt-xznxHU4O_zUD4i8hcoJUmnFiXgKige3B4YJeg-JMiTJgW8GTb-6R-e5yxPy_06mL-rErceTBSd_-xcSQW89cG5FVEzqYdGTwRYEUCc9Vbo6NQjJXnlW10N2GFLp0v8IW_YL2Hg==',
            punctuation: '.',
          },
        ],
      },
      {
        title: '3. Legal basis for processing',
        paragraphs: [
          'We process your data based on your consent when submitting the contact form and/or because the processing is necessary to respond to your request.',
        ],
      },
      {
        title: '4. How long do we retain your data?',
        paragraphs: [
          'Your data will only be kept for as long as necessary to respond to your request or comply with applicable legal obligations.',
        ],
      },
      {
        title: '5. Data sharing',
        paragraphs: [
          'Your data is not sold or shared with third parties for commercial purposes.',
          'It may be processed by technology service providers that support the operation of this website (for example, hosting or email services), always in compliance with the General Data Protection Regulation (GDPR).',
        ],
      },
      {
        title: '6. Security',
        paragraphs: [
          'We adopt appropriate technical and organizational measures to protect your data against unauthorized access, loss, alteration, or disclosure.',
        ],
      },
      {
        title: '7. Your rights',
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
        title: '8. Contact',
        paragraphs: [
          'If you have any questions about this Privacy Policy or the processing of your personal data, you can contact us via:',
        ],
        emailLabel: 'Email',
      },
      {
        title: '9. Changes to this policy',
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
        title: '2. ¿Para qué utilizamos tus datos?',
        paragraphs: [
          'A través del formulario de contacto de nuestra página principal, podemos recopilar tu nombre, dirección de correo electrónico y cualquier información adicional que decidas incluir en tu mensaje. Utilizamos esta información solo para responder a tus preguntas o solicitudes y hacer seguimiento de tu consulta. No la utilizamos con fines de marketing sin tu consentimiento.',
        ],
        afterItemsParagraphs: [
          {
            text: 'En la página Java Versions, podemos recopilar tu dirección de correo electrónico a través del formulario de suscripción y la almacenamos en Brevo, la plataforma de correo electrónico que utilizamos para gestionar suscripciones y enviar actualizaciones. Con tu consentimiento, utilizamos tu dirección de correo electrónico únicamente para enviarte actualizaciones sobre el diagrama Java Versions. Puedes cancelar la suscripción en cualquier momento',
            label: 'darse de baja',
            url: 'https://be4394eb.sibforms.com/serve/MUIFANPyJafzkKfGEAdpSgazgEuSSTz1UL-Bb1yThG6ElUbZV1KxGDHYbP1N-2DJNplNdKX9OwBFZHk1rW5tMX4854yPZUE13V_02mp2yCR9Ar04nRYa2W3UZ4qCcwABe5tRbPCPYbh1_-OgSjAICLtLT1g3oE_p-HYBUmjA03U97hDfA3voHRN6gZl8H1n3Ob7mSFKk3n3yCFP-sQ==',
            punctuation: '.',
          },
          {
            text: 'En la página IaC Examples, podemos recopilar tu dirección de correo electrónico a través del formulario de suscripción y la almacenamos en Brevo, la plataforma de correo electrónico que utilizamos para gestionar suscripciones y enviar actualizaciones. Con tu consentimiento, utilizamos tu dirección de correo electrónico únicamente para enviarte actualizaciones sobre IaC Examples. Puedes cancelar la suscripción en cualquier momento',
            label: 'cancelar la suscripción',
            url: 'https://be4394eb.sibforms.com/serve/MUIFAM0Nw_PHJOq72d5O8NTbA6PMlo9GZL30QtM8qYXei7o0v_v4wfCUFfD53hW07y-fEDDJFf-YyD1Rljgz4pCbnHjmzaWWya01BKUNFVvV9CEeZvsB8X97N2mdwFxN0wFp9lokUxGw_ThGryEbx63DChmTpwrv5-opx9R63Hh7OHAORHw4AwyR4vKKYZeWqAij7gJe9zxrwsPCvA==',
            punctuation: '.',
          },
        ],
      },
      {
        title: '3. Base legal para el tratamiento',
        paragraphs: [
          'Tratamos tus datos con base en tu consentimiento al enviar el formulario de contacto y/o porque el tratamiento es necesario para responder a tu solicitud.',
        ],
      },
      {
        title: '4. ¿Durante cuánto tiempo conservamos los datos?',
        paragraphs: [
          'Tus datos solo se conservarán durante el tiempo necesario para responder a tu solicitud o cumplir con las obligaciones legales aplicables.',
        ],
      },
      {
        title: '5. Cesión de datos',
        paragraphs: [
          'Tus datos no se venden ni se ceden a terceros con fines comerciales.',
          'Pueden ser tratados por proveedores de servicios tecnológicos que apoyan el funcionamiento de este sitio web (por ejemplo, alojamiento o envío de correos electrónicos), siempre de conformidad con el Reglamento General de Protección de Datos (RGPD).',
        ],
      },
      {
        title: '6. Seguridad',
        paragraphs: [
          'Adoptamos medidas técnicas y organizativas adecuadas para proteger tus datos contra accesos no autorizados, pérdida, alteración o divulgación.',
        ],
      },
      {
        title: '7. Tus derechos',
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
        title: '8. Contacto',
        paragraphs: [
          'Si tienes alguna pregunta sobre esta Política de Privacidad o sobre el tratamiento de tus datos personales, puedes contactarnos a través de:',
        ],
        emailLabel: 'Correo electrónico',
      },
      {
        title: '9. Cambios en esta política',
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
