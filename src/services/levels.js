export default {
    data() {
        return {
            levelsRu: [
                {
                    id: 0,
                    level: '0',
                    title: 'Базовый'
                },
                {
                    id: 1,
                    level: '1',
                    title: 'Пионеры Технологий',
                    text: 'Начальный уровень для тех, кто только начинает свой путь. Подобно началу нового тысячелетия, это первые шаги в развитии.',
                    params: {
                        CPU: '2 vCPU',
                        RAM: '4 GB',
                        HDD: 'SSD 35 GB',
                        // VRAM: '132 MB',
                    },
                    stars: {
                        first: 'Базовая поддержка',
                        second: 'Начальные бонусы',
                        third: 'Обучение',
                    },
                    income: '1'
                },
                {
                    id: 2,
                    level: '2',
                    title: 'Эпоха Изобретений',
                    text: 'Пользователи на этом уровне предоставляют мощности, соответствующие началу цифровой эры 2000-х годов. Они получают повышенные вознаграждения и доступ к улучшенным инструментам.',
                    params: {
                        CPU: '4 vCPU',
                        RAM: '8 GB',
                        HDD: 'SSD 512 GB',
                        // VRAM: '123 MB',
                    },
                    stars: {
                        first: 'Увеличенная награда',
                        second: 'Лучшие инструменты',
                        third: 'Обучение',
                    },
                    income: '2'
                },
                {

                    id: 3,
                    level: '3',
                    title: 'Электронная Революция',
                    text: 'Этот уровень для пользователей, которые предоставляют более значительные ресурсы, соответствующие современным требованиям. Они получают приоритетную поддержку и доступ к эксклюзивным возможностям.',
                    params: {
                        CPU: '8 vCPU',
                        RAM: '16 GB',
                        HDD: 'SSD 1 TB',
                        // VRAM: '132 MB',
                    },
                    stars: {
                        first: 'Приоритетная поддержка',
                        second: 'Эксклюзивные бонусы    ',
                        third: 'Участие в закрытых мероприятиях',
                    },
                    income: '3'
                },
                {
                    id: 4,
                    level: '4',
                    title: 'Космический Век',
                    text: 'Как и технологии нового поколения, эти пользователи предоставляют мощные вычислительные ресурсы, получая высокие вознаграждения и признание в сообществе.',
                    params: {
                        CPU: '16 vCPU',
                        RAM: '32 GB',
                        HDD: 'SSD 2 TB',
                        // VRAM: '132 MB',
                    },
                    stars: {
                        first: 'Высокие вознаграждения',
                        second: 'Доступ к бета-версиям новых функций',
                        third: 'Персональная поддержка',
                    },
                    income: '4'
                },
                {
                    id: 5,
                    level: '5',
                    title: 'Цифровая Трансформация',
                    text: 'Пользователи играют ключевую роль в развитии сети, предоставляя огромные мощности и получая значительное влияние и возможности в проекте.',
                    params: {
                        CPU: '32 vCPU',
                        RAM: '64 GB',
                        HDD: 'SSD 4 TB',
                        // VRAM: '132 MB',
                    },
                    stars: {
                        first: 'Значительное влияние на проект',
                        second: 'Эксклюзивные события',
                        third: 'Участие в принятии решений',
                    },
                    income: '5'
                },
                {
                    id: 6,
                    level: '6',
                    title: 'Информационная Эра',
                    text: 'Эти пользователи, подобно технологии сингулярности, помогают формировать будущее проекта. Их вклад неоценим, и они получают максимальные вознаграждения и эксклюзивные возможности.',
                    params: {
                        CPU: '64 vCPU',
                        RAM: '132 GB',
                        HDD: 'SSD 8 TB',
                        // VRAM: '132 MB',
                    },
                    stars: {
                        first: 'Максимальные вознаграждения',
                        second: 'Эксклюзивные привилегии',
                        third: 'Доступ к стратегическим встречам',
                    },
                    income: '6'

                },
                {
                    id: 7,
                    level: '7',
                    title: 'Квантовый Переход',
                    text: 'Пользователи являются вершиной  цепи. Их ресурсы и вклад в проект являются основополагающими для достижения технологической сингулярности.',
                    params: {
                        CPU: '128 vCPU',
                        RAM: '262 GB',
                        HDD: 'SSD 16 TB',
                        // VRAM: '132 MB',
                    },
                    stars: {
                        first: 'Все возможные бонусы и привилегии',
                        second: 'Признание в сообществе',
                        third: 'Участие в глобальных инициативах проекта',
                    },
                    income: '7'
                },
            ],
            levelsEn: [
                {
                    id: 0,
                    level: '0',
                    title: 'Basic'
                },
                {
                    id: 1,
                    level: '1',
                    title: 'Pioneers of Technology',
                    text: 'The initial level for those just starting their journey in. Like the beginning of a new millennium, these are the first steps in development.',
                    params: {
                        CPU: '2 vCPU',
                        RAM: '4 GB',
                        HDD: 'SSD 35 GB',
                    },
                    stars: {
                        first: 'Basic support',
                        second: 'Initial bonuses',
                        third: 'Training',
                    },
                    income: '1'
                },
                {
                    id: 2,
                    level: '2',
                    title: 'Era of Inventions',
                    text: 'Users at this level provide resources equivalent to the start of the digital era in the 2000s. They receive increased rewards and access to improved tools.',
                    params: {
                        CPU: '4 vCPU',
                        RAM: '8 GB',
                        HDD: 'SSD 512 GB',
                    },
                    stars: {
                        first: 'Increased reward',
                        second: 'Better tools',
                        third: 'Training',
                    },
                    income: '2'
                },
                {
                    id: 3,
                    level: '3',
                    title: 'Electronic Revolution',
                    text: 'This level is for users who provide significant resources meeting modern demands. They receive priority support and access to exclusive opportunities.',
                    params: {
                        CPU: '8 vCPU',
                        RAM: '16 GB',
                        HDD: 'SSD 1 TB',
                    },
                    stars: {
                        first: 'Priority support',
                        second: 'Exclusive bonuses',
                        third: 'Participation in closed events',
                    },
                    income: '3'
                },
                {
                    id: 4,
                    level: '4',
                    title: 'Space Age',
                    text: 'Like new-generation technology, these users provide powerful computing resources, earning high rewards and recognition in the community.',
                    params: {
                        CPU: '16 vCPU',
                        RAM: '32 GB',
                        HDD: 'SSD 2 TB',
                    },
                    stars: {
                        first: 'High rewards',
                        second: 'Access to beta versions of new features',
                        third: 'Personal support',
                    },
                    income: '4'
                },
                {
                    id: 5,
                    level: '5',
                    title: 'Digital Transformation',
                    text: 'Digital transformation users play a key role in network development, providing massive resources and gaining significant influence and opportunities in the project.',
                    params: {
                        CPU: '32 vCPU',
                        RAM: '64 GB',
                        HDD: 'SSD 4 TB',
                    },
                    stars: {
                        first: 'Significant project influence',
                        second: 'Exclusive events',
                        third: 'Participation in decision-making',
                    },
                    income: '5'
                },
                {
                    id: 6,
                    level: '6',
                    title: 'Information Era',
                    text: 'These users, like singularity technology, help shape the project\'s future. Their contribution is invaluable, and they receive maximum rewards and exclusive opportunities.',
                    params: {
                        CPU: '64 vCPU',
                        RAM: '132 GB',
                        HDD: 'SSD 8 TB',
                    },
                    stars: {
                        first: 'Maximum rewards',
                        second: 'Exclusive privileges',
                        third: 'Access to strategic meetings',
                    },
                    income: '6'
                },
                {
                    id: 7,
                    level: '7',
                    title: 'Quantum Leap',
                    text: 'Quantum leap users are the pinnacle of the chain. Their resources and contributions to the project are foundational for achieving technological singularity.',
                    params: {
                        CPU: '128 vCPU',
                        RAM: '262 GB',
                        HDD: 'SSD 16 TB',
                    },
                    stars: {
                        first: 'All possible bonuses and privileges',
                        second: 'Community recognition',
                        third: 'Participation in global project initiatives',
                    },
                    income: '7'
                },
            ],
            
            levelsEs: [
                {
                    id: 0,
                    level: '0',
                    title: 'Básico'
                },
                {
                    id: 1,
                    level: '1',
                    title: 'Pioneros de la Tecnología',
                    text: 'El nivel inicial para quienes comienzan su camino. Al igual que el comienzo de un nuevo milenio, estos son los primeros pasos en el desarrollo.',
                    params: {
                        CPU: '2 vCPU',
                        RAM: '4 GB',
                        HDD: 'SSD 35 GB',
                    },
                    stars: {
                        first: 'Soporte básico',
                        second: 'Bonificaciones iniciales',
                        third: 'Entrenamiento',
                    },
                    income: '1'
                },
                {
                    id: 2,
                    level: '2',
                    title: 'Era de los Inventos',
                    text: 'Los usuarios en este nivel proporcionan recursos equivalentes al inicio de la era digital en los años 2000. Reciben mayores recompensas y acceso a herramientas mejoradas.',
                    params: {
                        CPU: '4 vCPU',
                        RAM: '8 GB',
                        HDD: 'SSD 512 GB',
                    },
                    stars: {
                        first: 'Recompensa incrementada',
                        second: 'Mejores herramientas',
                        third: 'Entrenamiento',
                    },
                    income: '2'
                },
                {
                    id: 3,
                    level: '3',
                    title: 'Revolución Electrónica',
                    text: 'Este nivel es para usuarios que proporcionan recursos significativos que cumplen con las demandas modernas. Reciben soporte prioritario y acceso a oportunidades exclusivas.',
                    params: {
                        CPU: '8 vCPU',
                        RAM: '16 GB',
                        HDD: 'SSD 1 TB',
                    },
                    stars: {
                        first: 'Soporte prioritario',
                        second: 'Bonificaciones exclusivas',
                        third: 'Participación en eventos cerrados',
                    },
                    income: '3'
                },
                {
                    id: 4,
                    level: '4',
                    title: 'Era Espacial',
                    text: 'Al igual que la tecnología de nueva generación, estos usuarios proporcionan recursos informáticos poderosos, obteniendo grandes recompensas y reconocimiento en la comunidad.',
                    params: {
                        CPU: '16 vCPU',
                        RAM: '32 GB',
                        HDD: 'SSD 2 TB',
                    },
                    stars: {
                        first: 'Grandes recompensas',
                        second: 'Acceso a versiones beta de nuevas funciones',
                        third: 'Soporte personal',
                    },
                    income: '4'
                },
                {
                    id: 5,
                    level: '5',
                    title: 'Transformación Digital',
                    text: 'Los usuarios en la transformación digital juegan un papel clave en el desarrollo de la red, proporcionando recursos masivos y ganando influencia significativa y oportunidades en el proyecto.',
                    params: {
                        CPU: '32 vCPU',
                        RAM: '64 GB',
                        HDD: 'SSD 4 TB',
                    },
                    stars: {
                        first: 'Influencia significativa en el proyecto',
                        second: 'Eventos exclusivos',
                        third: 'Participación en la toma de decisiones',
                    },
                    income: '5'
                },
                {
                    id: 6,
                    level: '6',
                    title: 'Era de la Información',
                    text: 'Estos usuarios, como la tecnología de singularidad, ayudan a dar forma al futuro del proyecto. Su contribución es invaluable, y reciben recompensas máximas y oportunidades exclusivas.',
                    params: {
                        CPU: '64 vCPU',
                        RAM: '132 GB',
                        HDD: 'SSD 8 TB',
                    },
                    stars: {
                        first: 'Recompensas máximas',
                        second: 'Privilegios exclusivos',
                        third: 'Acceso a reuniones estratégicas',
                    },
                    income: '6'
                },
                {
                    id: 7,
                    level: '7',
                    title: 'Salto Cuántico',
                    text: 'Los usuarios del salto cuántico son la cima de la cadena. Sus recursos y contribuciones al proyecto son fundamentales para lograr la singularidad tecnológica.',
                    params: {
                        CPU: '128 vCPU',
                        RAM: '262 GB',
                        HDD: 'SSD 16 TB',
                    },
                    stars: {
                        first: 'Todos los bonos y privilegios posibles',
                        second: 'Reconocimiento en la comunidad',
                        third: 'Participación en iniciativas globales del proyecto',
                    },
                    income: '7'
                },
            ],
            
            levelsDe: [
                {
                    id: 0,
                    level: '0',
                    title: 'Basis'
                },
                {
                    id: 1,
                    level: '1',
                    title: 'Pioniere der Technologie',
                    text: 'Die Einstiegsstufe für diejenigen, die gerade erst beginnen. Wie der Beginn eines neuen Jahrtausends sind dies die ersten Schritte in der Entwicklung.',
                    params: {
                        CPU: '2 vCPU',
                        RAM: '4 GB',
                        HDD: 'SSD 35 GB',
                    },
                    stars: {
                        first: 'Grundlegende Unterstützung',
                        second: 'Anfangsboni',
                        third: 'Schulung',
                    },
                    income: '1'
                },
                {
                    id: 2,
                    level: '2',
                    title: 'Zeitalter der Erfindungen',
                    text: 'Benutzer auf dieser Ebene stellen Ressourcen bereit, die dem Beginn des digitalen Zeitalters in den 2000er Jahren entsprechen. Sie erhalten erhöhte Belohnungen und Zugang zu verbesserten Tools.',
                    params: {
                        CPU: '4 vCPU',
                        RAM: '8 GB',
                        HDD: 'SSD 512 GB',
                    },
                    stars: {
                        first: 'Erhöhte Belohnung',
                        second: 'Bessere Werkzeuge',
                        third: 'Schulung',
                    },
                    income: '2'
                },
                {
                    id: 3,
                    level: '3',
                    title: 'Elektronische Revolution',
                    text: 'Diese Stufe ist für Benutzer gedacht, die signifikante Ressourcen bereitstellen, die den modernen Anforderungen entsprechen. Sie erhalten priorisierte Unterstützung und Zugang zu exklusiven Möglichkeiten.',
                    params: {
                        CPU: '8 vCPU',
                        RAM: '16 GB',
                        HDD: 'SSD 1 TB',
                    },
                    stars: {
                        first: 'Priorisierte Unterstützung',
                        second: 'Exklusive Boni',
                        third: 'Teilnahme an geschlossenen Veranstaltungen',
                    },
                    income: '3'
                },
                {
                    id: 4,
                    level: '4',
                    title: 'Raumfahrtzeitalter',
                    text: 'Wie Technologien der neuen Generation bieten diese Benutzer leistungsstarke Rechenressourcen, erhalten hohe Belohnungen und Anerkennung in der Community.',
                    params: {
                        CPU: '16 vCPU',
                        RAM: '32 GB',
                        HDD: 'SSD 2 TB',
                    },
                    stars: {
                        first: 'Hohe Belohnungen',
                        second: 'Zugang zu Beta-Versionen neuer Funktionen',
                        third: 'Persönlicher Support',
                    },
                    income: '4'
                },
                {
                    id: 5,
                    level: '5',
                    title: 'Digitale Transformation',
                    text: 'Benutzer der digitalen Transformation spielen eine Schlüsselrolle bei der Netzwerkentwicklung, indem sie massive Ressourcen bereitstellen und erheblichen Einfluss und Möglichkeiten im Projekt gewinnen.',
                    params: {
                        CPU: '32 vCPU',
                        RAM: '64 GB',
                        HDD: 'SSD 4 TB',
                    },
                    stars: {
                        first: 'Erheblicher Projekteffekt',
                        second: 'Exklusive Veranstaltungen',
                        third: 'Teilnahme an Entscheidungsprozessen',
                    },
                    income: '5'
                },
                {
                    id: 6,
                    level: '6',
                    title: 'Informationszeitalter',
                    text: 'Diese Benutzer, ähnlich wie Singularitätstechnologie, helfen dabei, die Zukunft des Projekts zu gestalten. Ihr Beitrag ist unbezahlbar, und sie erhalten maximale Belohnungen und exklusive Möglichkeiten.',
                    params: {
                        CPU: '64 vCPU',
                        RAM: '132 GB',
                        HDD: 'SSD 8 TB',
                    },
                    stars: {
                        first: 'Maximale Belohnungen',
                        second: 'Exklusive Privilegien',
                        third: 'Zugang zu strategischen Sitzungen',
                    },
                    income: '6'
                },
                {
                    id: 7,
                    level: '7',
                    title: 'Quantensprung',
                    text: 'Quantensprung-Benutzer sind der Höhepunkt der Kette. Ihre Ressourcen und ihr Beitrag zum Projekt sind grundlegend, um technologische Singularität zu erreichen.',
                    params: {
                        CPU: '128 vCPU',
                        RAM: '262 GB',
                        HDD: 'SSD 16 TB',
                    },
                    stars: {
                        first: 'Alle möglichen Boni und Privilegien',
                        second: 'Anerkennung in der Community',
                        third: 'Teilnahme an globalen Projektinitiativen',
                    },
                    income: '7'
                },
            ],
            
            levelsFr: [
                {
                    id: 0,
                    level: '0',
                    title: 'Basique'
                },
                {
                    id: 1,
                    level: '1',
                    title: 'Pionniers de la Technologie',
                    text: 'Le niveau initial pour ceux qui commencent leur parcours. Tout comme le début d’un nouveau millénaire, ce sont les premières étapes du développement.',
                    params: {
                        CPU: '2 vCPU',
                        RAM: '4 GB',
                        HDD: 'SSD 35 GB',
                    },
                    stars: {
                        first: 'Support de base',
                        second: 'Bonus initiaux',
                        third: 'Formation',
                    },
                    income: '1'
                },
                {
                    id: 2,
                    level: '2',
                    title: 'Ère des Inventions',
                    text: 'Les utilisateurs à ce niveau fournissent des ressources équivalentes au début de l’ère numérique des années 2000. Ils reçoivent des récompenses accrues et un accès à des outils améliorés.',
                    params: {
                        CPU: '4 vCPU',
                        RAM: '8 GB',
                        HDD: 'SSD 512 GB',
                    },
                    stars: {
                        first: 'Récompense accrue',
                        second: 'Meilleurs outils',
                        third: 'Formation',
                    },
                    income: '2'
                },
                {
                    id: 3,
                    level: '3',
                    title: 'Révolution Électronique',
                    text: 'Ce niveau est destiné aux utilisateurs qui fournissent des ressources importantes répondant aux exigences modernes. Ils bénéficient d’un support prioritaire et d’un accès à des opportunités exclusives.',
                    params: {
                        CPU: '8 vCPU',
                        RAM: '16 GB',
                        HDD: 'SSD 1 TB',
                    },
                    stars: {
                        first: 'Support prioritaire',
                        second: 'Bonus exclusifs',
                        third: 'Participation à des événements fermés',
                    },
                    income: '3'
                },
                {
                    id: 4,
                    level: '4',
                    title: 'Ère Spatiale',
                    text: 'Comme les technologies de nouvelle génération, ces utilisateurs offrent des ressources informatiques puissantes, obtenant des récompenses élevées et une reconnaissance au sein de la communauté.',
                    params: {
                        CPU: '16 vCPU',
                        RAM: '32 GB',
                        HDD: 'SSD 2 TB',
                    },
                    stars: {
                        first: 'Récompenses élevées',
                        second: 'Accès aux versions bêta des nouvelles fonctionnalités',
                        third: 'Support personnalisé',
                    },
                    income: '4'
                },
                {
                    id: 5,
                    level: '5',
                    title: 'Transformation Numérique',
                    text: 'Les utilisateurs de la transformation numérique jouent un rôle clé dans le développement du réseau, fournissant des ressources massives et obtenant une influence significative et des opportunités dans le projet.',
                    params: {
                        CPU: '32 vCPU',
                        RAM: '64 GB',
                        HDD: 'SSD 4 TB',
                    },
                    stars: {
                        first: 'Influence significative sur le projet',
                        second: 'Événements exclusifs',
                        third: 'Participation à la prise de décisions',
                    },
                    income: '5'
                },
                {
                    id: 6,
                    level: '6',
                    title: 'Ère de l’Information',
                    text: 'Ces utilisateurs, comme la technologie de singularité, aident à façonner l’avenir du projet. Leur contribution est inestimable, et ils reçoivent des récompenses maximales et des opportunités exclusives.',
                    params: {
                        CPU: '64 vCPU',
                        RAM: '132 GB',
                        HDD: 'SSD 8 TB',
                    },
                    stars: {
                        first: 'Récompenses maximales',
                        second: 'Privilèges exclusifs',
                        third: 'Accès à des réunions stratégiques',
                    },
                    income: '6'
                },
                {
                    id: 7,
                    level: '7',
                    title: 'Transition Quantique',
                    text: 'Les utilisateurs de la transition quantique sont au sommet de la chaîne. Leurs ressources et leur contribution au projet sont fondamentales pour atteindre la singularité technologique.',
                    params: {
                        CPU: '128 vCPU',
                        RAM: '262 GB',
                        HDD: 'SSD 16 TB',
                    },
                    stars: {
                        first: 'Tous les bonus et privilèges possibles',
                        second: 'Reconnaissance dans la communauté',
                        third: 'Participation aux initiatives mondiales du projet',
                    },
                    income: '7'
                },
            ],
            
            levelsPt: [
                {
                    id: 0,
                    level: '0',
                    title: 'Básico'
                },
                {
                    id: 1,
                    level: '1',
                    title: 'Pioneiros da Tecnologia',
                    text: 'O nível inicial para aqueles que estão começando sua jornada. Assim como o início de um novo milênio, esses são os primeiros passos no desenvolvimento.',
                    params: {
                        CPU: '2 vCPU',
                        RAM: '4 GB',
                        HDD: 'SSD 35 GB',
                    },
                    stars: {
                        first: 'Suporte básico',
                        second: 'Bônus iniciais',
                        third: 'Treinamento',
                    },
                    income: '1'
                },
                {
                    id: 2,
                    level: '2',
                    title: 'Era das Invenções',
                    text: 'Os usuários neste nível fornecem recursos equivalentes ao início da era digital nos anos 2000. Eles recebem recompensas maiores e acesso a ferramentas melhoradas.',
                    params: {
                        CPU: '4 vCPU',
                        RAM: '8 GB',
                        HDD: 'SSD 512 GB',
                    },
                    stars: {
                        first: 'Recompensa aumentada',
                        second: 'Melhores ferramentas',
                        third: 'Treinamento',
                    },
                    income: '2'
                },
                {
                    id: 3,
                    level: '3',
                    title: 'Revolução Eletrônica',
                    text: 'Este nível é destinado a usuários que fornecem recursos significativos que atendem às demandas modernas. Eles recebem suporte prioritário e acesso a oportunidades exclusivas.',
                    params: {
                        CPU: '8 vCPU',
                        RAM: '16 GB',
                        HDD: 'SSD 1 TB',
                    },
                    stars: {
                        first: 'Suporte prioritário',
                        second: 'Bônus exclusivos',
                        third: 'Participação em eventos fechados',
                    },
                    income: '3'
                },
                {
                    id: 4,
                    level: '4',
                    title: 'Era Espacial',
                    text: 'Assim como a tecnologia de nova geração, esses usuários fornecem recursos computacionais poderosos, recebendo altas recompensas e reconhecimento na comunidade.',
                    params: {
                        CPU: '16 vCPU',
                        RAM: '32 GB',
                        HDD: 'SSD 2 TB',
                    },
                    stars: {
                        first: 'Altas recompensas',
                        second: 'Acesso a versões beta de novos recursos',
                        third: 'Suporte personalizado',
                    },
                    income: '4'
                },
                {
                    id: 5,
                    level: '5',
                    title: 'Transformação Digital',
                    text: 'Os usuários da transformação digital desempenham um papel crucial no desenvolvimento da rede, fornecendo recursos massivos e ganhando influência significativa e oportunidades no projeto.',
                    params: {
                        CPU: '32 vCPU',
                        RAM: '64 GB',
                        HDD: 'SSD 4 TB',
                    },
                    stars: {
                        first: 'Influência significativa no projeto',
                        second: 'Eventos exclusivos',
                        third: 'Participação na tomada de decisões',
                    },
                    income: '5'
                },
                {
                    id: 6,
                    level: '6',
                    title: 'Era da Informação',
                    text: 'Esses usuários, como a tecnologia de singularidade, ajudam a moldar o futuro do projeto. Sua contribuição é inestimável, e eles recebem recompensas máximas e oportunidades exclusivas.',
                    params: {
                        CPU: '64 vCPU',
                        RAM: '132 GB',
                        HDD: 'SSD 8 TB',
                    },
                    stars: {
                        first: 'Recompensas máximas',
                        second: 'Privilégios exclusivos',
                        third: 'Acesso a reuniões estratégicas',
                    },
                    income: '6'
                },
                {
                    id: 7,
                    level: '7',
                    title: 'Transição Quântica',
                    text: 'Os usuários da transição quântica estão no topo da cadeia. Seus recursos e contribuições para o projeto são fundamentais para alcançar a singularidade tecnológica.',
                    params: {
                        CPU: '128 vCPU',
                        RAM: '262 GB',
                        HDD: 'SSD 16 TB',
                    },
                    stars: {
                        first: 'Todos os bônus e privilégios possíveis',
                        second: 'Reconhecimento na comunidade',
                        third: 'Participação em iniciativas globais do projeto',
                    },
                    income: '7'
                },
            ],
            

        }
    }
}




