import type { Locale } from "@/lib/i18n/config";
import type { Project, Experience, SiteSettings } from "@prisma/client";

/**
 * Translated content for the (otherwise English) database records. Keyed by a
 * stable identifier (project slug, experience role). Proper nouns — product
 * names, technologies — are intentionally left untranslated. English (`en`) is
 * the source of truth in the DB, so only `ru` and `es` overlays live here.
 */

type ProjectTranslation = Partial<
  Pick<
    Project,
    | "category"
    | "tagline"
    | "heroSubheadline"
    | "story"
    | "problem"
    | "solution"
    | "architecture"
    | "results"
  >
>;

const projectContent: Record<string, Partial<Record<Locale, ProjectTranslation>>> = {
  convertra: {
    ru: {
      category: "Приложение для macOS",
      tagline:
        "Нативное macOS-приложение для диджеев и музыкальных профессионалов — библиотека, анализ и конвертация, всё локально.",
      heroSubheadline:
        "Нативное приложение для macOS, созданное для диджеев и музыкальных профессионалов, чтобы управлять, анализировать и конвертировать аудиобиблиотеки полностью на устройстве.",
      story:
        "Convertra выросла из простой проблемы, знакомой каждому работающему диджею: треки разбросаны по разным форматам, нет быстрого способа проверить совместимость по тональности и BPM, а облачные инструменты не уважают локальный офлайн-процесс. Convertra создавалась как нативный дом для библиотеки диджея на macOS — быстрый, приватный и точный.",
      problem:
        "Диджеям и музыкальным профессионалам нужно быстро импортировать, организовывать и готовить большие аудиобиблиотеки, но существующие инструменты либо работают через веб, либо медленные, либо не имеют точного определения BPM и тональности, необходимого для гармоничного сведения по колесу Camelot.",
      solution:
        "Convertra поставляется как нативное приложение для macOS с локальным импортом аудио, управлением библиотекой, анализом BPM и тональности, нотацией Camelot, редактированием метаданных, встроенным плеером и конвертацией в MP3 — всё обрабатывается локально, без загрузки файлов куда-либо.",
      architecture:
        "Создано нативно для macOS на Swift и SwiftUI. Импорт аудио и управление библиотекой работают на устройстве, опираясь на локальный конвейер анализа (см. Convertra AudioCore), который определяет BPM, тональность и выполняет конвертацию Camelot без сетевых зависимостей.",
      results:
        "Полностью локальный, готовый к продакшену инструмент для библиотеки диджея, позволяющий профессионалам анализировать и готовить треки за секунды вместо минут, без облачных зависимостей и с полным контролем над своими файлами.",
    },
    es: {
      category: "App para macOS",
      tagline:
        "App nativa de macOS para DJs y profesionales de la música — biblioteca, análisis y conversión, todo local.",
      heroSubheadline:
        "Una aplicación nativa de macOS creada para DJs y profesionales de la música para gestionar, analizar y convertir sus bibliotecas de audio totalmente en el dispositivo.",
      story:
        "Convertra nació de una frustración simple que comparten los DJs en activo: bibliotecas de pistas dispersas en distintos formatos, sin forma rápida de comprobar la compatibilidad de tonalidad y BPM, y herramientas en la nube que no respetan un flujo de trabajo local y sin conexión. Convertra se construyó para ser el hogar nativo en macOS de la biblioteca de un DJ: rápido, privado y preciso.",
      problem:
        "Los DJs y profesionales de la música necesitan importar, organizar y preparar grandes bibliotecas de audio rápidamente, pero las herramientas existentes son web, lentas o carecen de la detección precisa de BPM y tonalidad necesaria para la mezcla armónica con la rueda Camelot.",
      solution:
        "Convertra se ofrece como una app nativa de macOS con importación de audio local, gestión de biblioteca, análisis de BPM y tonalidad, notación Camelot, edición de metadatos, un reproductor integrado y conversión a MP3, todo procesado localmente sin subir archivos a ningún sitio.",
      architecture:
        "Construida de forma nativa para macOS con Swift y SwiftUI. La importación de audio y la gestión de la biblioteca se ejecutan en el dispositivo, respaldadas por un pipeline de análisis local (ver Convertra AudioCore) que detecta BPM, tonalidad y realiza la conversión Camelot sin dependencia de red.",
      results:
        "Una herramienta de biblioteca de DJ totalmente local y lista para producción que permite a los profesionales analizar y preparar pistas en segundos en lugar de minutos, sin dependencia de la nube y con control total sobre sus archivos.",
    },
  },
  audiocore: {
    ru: {
      category: "Аудиодвижок",
      tagline: "Собственный DSP-движок, стоящий за аудиоанализом Convertra.",
      heroSubheadline:
        "Собственный движок цифровой обработки сигналов, обеспечивающий точный и полностью локальный аудиоанализ для Convertra.",
      story:
        "Точное определение BPM и тональности — фундамент, от которого зависит любой рабочий процесс диджея. Вместо того чтобы полагаться на сторонние сервисы анализа, AudioCore был создан как отдельный локальный DSP-движок, заточенный именно под задачи диджеинга.",
      problem:
        "Готовые библиотеки аудиоанализа либо неточны для электронной и танцевальной музыки, либо требуют облачной обработки, либо слишком медленны для сканирования больших библиотек.",
      solution:
        "AudioCore — это собственный аудиодвижок, который определяет BPM, музыкальную тональность и выполняет конвертацию по колесу Camelot полностью на устройстве, обёрнутый в Swift-движок, спроектированный для скорости и точности на масштабе библиотеки.",
      architecture:
        "Нативный аудиодвижок на Swift, реализующий DSP-конвейеры для отслеживания темпа и анализа тональности/хромы, преобразуя результаты в нотацию Camelot для гармоничного сведения. Спроектирован как автономное ядро, чтобы питать Convertra и будущие аудиоинструменты без обращений к серверу.",
      results:
        "Позволяет Convertra анализировать целые библиотеки локально, в реальном времени, с профессиональной точностью BPM и тональности и без единого байта данных, покидающего машину пользователя.",
    },
    es: {
      category: "Motor de audio",
      tagline: "El motor DSP propio detrás del análisis de audio de Convertra.",
      heroSubheadline:
        "Un motor de procesamiento digital de señales propio que impulsa un análisis de audio preciso y totalmente local para Convertra.",
      story:
        "La detección precisa de BPM y tonalidad es la base de la que depende todo flujo de trabajo de un DJ. En lugar de depender de servicios de análisis de terceros, AudioCore se construyó como un motor DSP dedicado y local, afinado específicamente para los casos de uso de DJ.",
      problem:
        "Las bibliotecas de análisis de audio estándar son imprecisas para la música electrónica y de baile, requieren procesamiento en la nube o son demasiado lentas para escanear grandes bibliotecas.",
      solution:
        "AudioCore es un motor de audio hecho a medida que detecta BPM, tonalidad musical y realiza la conversión de la rueda Camelot totalmente en el dispositivo, envuelto en un motor de audio en Swift diseñado para la velocidad y la precisión a escala de biblioteca.",
      architecture:
        "Un motor de audio nativo en Swift que implementa pipelines DSP para el seguimiento de tempo y el análisis de tonalidad/croma, convirtiendo los resultados en notación Camelot para la mezcla armónica. Diseñado como un núcleo independiente para impulsar Convertra y futuras herramientas de audio sin ninguna ida y vuelta al servidor.",
      results:
        "Permite a Convertra analizar bibliotecas completas de forma local, en tiempo real, con precisión profesional de BPM y tonalidad, y sin que ningún dato salga de la máquina del usuario.",
    },
  },
  forzadj: {
    ru: {
      category: "Веб-платформа",
      tagline:
        "DJ-pool платформа с входом через Telegram, публикацией и инструментами сообщества.",
      heroSubheadline:
        "DJ-pool платформа, объединяющая музыкальных профессионалов через нативный вход Telegram, публикацию контента и управление каталогом.",
      story:
        "DJ-pool'ы традиционно полагаются на неудобные FTP-подобные загрузки и закрытые сообщества. ForzaDJ переосмысливает DJ-pool как современную веб-платформу, построенную вокруг Telegram — мессенджера, которым диджеи и лейблы уже пользуются каждый день.",
      problem:
        "Независимым диджеям и лейблам нужен лёгкий способ распространять и находить новую музыку, модерировать заявки и управлять растущим каталогом, не строя собственную инфраструктуру с нуля.",
      solution:
        "ForzaDJ предоставляет вход через Telegram для авторизации без трения, загрузку и публикацию музыки, управление каталогом и автоматизированную модерацию — превращая DJ-pool в самостоятельную платформу для музыкального сообщества.",
      architecture:
        "Веб-платформа, интегрирующая Telegram Login как основной слой авторизации, с конвейерами загрузки и публикации, связанными с автоматизированной модерацией и процессами управления каталогом, спроектированная для масштабирования вместе с растущим сообществом.",
      results:
        "Работающая DJ-pool платформа, где сообщество может входить через Telegram, публиковать и управлять музыкой, а автоматизация снижает нагрузку по ручной модерации.",
    },
    es: {
      category: "Plataforma web",
      tagline:
        "Una plataforma de DJ pool con inicio de sesión por Telegram, publicación y herramientas de comunidad.",
      heroSubheadline:
        "Una plataforma de DJ pool que conecta a profesionales de la música mediante inicio de sesión nativo de Telegram, publicación de contenido y gestión de catálogo.",
      story:
        "Los DJ pools tradicionalmente dependen de descargas tipo FTP torpes y comunidades cerradas. ForzaDJ reimagina el DJ pool como una plataforma web moderna construida en torno a Telegram, la app de mensajería que los DJs y sellos ya usan a diario.",
      problem:
        "Los DJs y sellos independientes necesitan una forma ligera de distribuir y descubrir música nueva, moderar envíos y gestionar un catálogo creciente sin construir infraestructura propia desde cero.",
      solution:
        "ForzaDJ ofrece inicio de sesión por Telegram para una autenticación sin fricción, subida y publicación de música, gestión de catálogo y moderación automatizada, convirtiendo un DJ pool en una plataforma autoservicio para una comunidad musical.",
      architecture:
        "Una plataforma web que integra Telegram Login como capa de autenticación principal, con pipelines de subida y publicación conectados a la moderación automatizada y a los flujos de catálogo, diseñada para escalar con una comunidad musical en crecimiento.",
      results:
        "Una plataforma de DJ pool funcional donde la comunidad puede iniciar sesión con Telegram, publicar y gestionar música, con automatización que reduce la carga de moderación manual.",
    },
  },
  automation: {
    ru: {
      category: "Система автоматизации",
      tagline:
        "Автоматизированные системы публикации контента, модерации и рабочих процессов на базе Telegram-ботов.",
      heroSubheadline:
        "Автоматизированные системы для публикации контента, модерации и оркестрации рабочих процессов, построенные вокруг Telegram-ботов и AI-конвейеров.",
      story:
        "Каждый продукт, который выпускает Гамид, рано или поздно требует автоматизации рутины: публикация, модерация, уведомления, контентные конвейеры. Этот набор систем вырос из многократного решения этой задачи в Convertra, ForzaDJ и других проектах.",
      problem:
        "Ручная публикация и модерация контента не масштабируются, а большинство готовых инструментов автоматизации не заточены под конкретные процессы нишевых музыкальных и продуктовых сообществ.",
      solution:
        "Набор Telegram-ботов и конвейеров автоматизации, которые берут на себя публикацию, модерацию и оркестрацию процессов — настраиваемые контентные конвейеры, встраивающиеся в существующие продукты.",
      architecture:
        "Интеграции с Telegram Bot API, питающие оркестрацию процессов и контентные конвейеры, поверх которых наложены правила модерации и автоматизация публикации, чтобы участие человека требовалось только в пограничных случаях.",
      results:
        "Значительное сокращение ручной работы по публикации и модерации в разных продуктах, с надёжными повторяемыми системами процессов, которые можно переиспользовать в новых продуктовых линейках.",
    },
    es: {
      category: "Sistema de automatización",
      tagline:
        "Sistemas automatizados de publicación de contenido, moderación y flujos de trabajo construidos sobre bots de Telegram.",
      heroSubheadline:
        "Sistemas automatizados para la publicación de contenido, la moderación y la orquestación de flujos de trabajo, construidos en torno a bots de Telegram y pipelines de IA.",
      story:
        "Cada producto que lanza Hamid acaba necesitando automatizar las partes tediosas: publicación, moderación, notificaciones, pipelines de contenido. Este conjunto de sistemas surgió de resolver ese problema repetidamente en Convertra, ForzaDJ y otros trabajos.",
      problem:
        "La publicación y moderación manual de contenido no escalan, y la mayoría de las herramientas de automatización estándar no están adaptadas a los flujos específicos de comunidades musicales y de producto de nicho.",
      solution:
        "Una colección de bots de Telegram y pipelines de automatización que gestionan la publicación, la moderación y la orquestación de flujos de trabajo: pipelines de contenido configurables que se conectan a los productos existentes.",
      architecture:
        "Integraciones con la API de Bots de Telegram que alimentan la orquestación de flujos y los pipelines de contenido, con reglas de moderación y automatización de publicación por encima, de modo que la revisión humana solo sea necesaria en casos límite.",
      results:
        "Una reducción significativa del trabajo manual de publicación y moderación en varios productos, con sistemas de flujo fiables y repetibles reutilizables en nuevas líneas de producto.",
    },
  },
};

const experienceContent: Record<string, Partial<Record<Locale, { role: string; description: string }>>> = {
  "Founder & AI Product Builder": {
    ru: {
      role: "Founder & AI Product Builder",
      description:
        "Создание AI-first цифровых продуктов от начала до конца — от продуктовой стратегии и UX до разработки с AI и запуска. Выпуск Convertra, Convertra AudioCore, ForzaDJ и систем автоматизации продуктов.",
    },
    es: {
      role: "Founder & AI Product Builder",
      description:
        "Creación de productos digitales AI-first de principio a fin — desde la estrategia de producto y UX hasta el desarrollo asistido por IA y el lanzamiento. Lanzamiento de Convertra, Convertra AudioCore, ForzaDJ y sistemas de automatización de productos.",
    },
  },
  "Senior Graphic Designer": {
    ru: {
      role: "Senior Graphic Designer",
      description:
        "Руководил визуальным дизайном для бренда и продукта, превращая креативное направление в готовые к продакшену ассеты и дизайн-системы.",
    },
    es: {
      role: "Senior Graphic Designer",
      description:
        "Lideré el diseño visual en superficies de marca y producto, traduciendo la dirección creativa en recursos listos para producción y sistemas de diseño.",
    },
  },
  "Art Director": {
    ru: {
      role: "Art Director",
      description:
        "Отвечал за креативное направление и айдентику бренда в кампаниях, продуктовых визуалах и motion-дизайне, соединяя творческое видение с исполнением.",
    },
    es: {
      role: "Art Director",
      description:
        "Responsable de la dirección creativa y la identidad de marca en campañas, visuales de producto y diseño de movimiento, uniendo la visión creativa con la ejecución.",
    },
  },
};

const heroContent: Partial<
  Record<Locale, { role: string; tagline: string; fullName?: string }>
> = {
  ru: {
    fullName: "Гамид Кязымов",
    role: "Основатель и AI Product Builder",
    tagline:
      "Я создаю реальные продукты с помощью AI — от стратегии и дизайна до запуска.",
  },
  es: {
    role: "Fundador y AI Product Builder",
    tagline:
      "Creo productos reales con IA — desde la estrategia y el diseño hasta el lanzamiento.",
  },
};

export function localizeProject<T extends Project>(project: T, locale: Locale): T {
  if (locale === "en") return project;
  const t = projectContent[project.slug]?.[locale];
  if (!t) return project;
  return { ...project, ...t };
}

export function localizeExperience(exp: Experience, locale: Locale): Experience {
  if (locale === "en") return exp;
  const t = experienceContent[exp.role]?.[locale];
  if (!t) return exp;
  return { ...exp, ...t };
}

export function localizeSettings(settings: SiteSettings, locale: Locale): SiteSettings {
  if (locale === "en") return settings;
  const t = heroContent[locale];
  if (!t) return settings;
  return {
    ...settings,
    fullName: t.fullName ?? settings.fullName,
    role: t.role,
    tagline: t.tagline,
  };
}
