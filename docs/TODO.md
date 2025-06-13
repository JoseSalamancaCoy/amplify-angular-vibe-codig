Quiero que a continuacion realices las siguientes tareas:
1. Necesito que protegas el endpoint para que solo usuarios autenticados puedan hacer consultas.
2. Explora la pagina web de purplelab https://purplelab.com/ extra la paleta de colores, tipografias y caracteristicas claves del sistema de dise;o (Botones, textos, tamanos entre otros) a tener en cuenta y construye un SystemDesign.md (SystemDesign). 
3. Con el SystemDesgin.md crea los docuemntos de styles especificos para usarlos en el proyecto
4. Necesito que explores todas las guias relacionadas a autenticacion de aws Amplify (https://ui.docs.amplify.aws/angular/connected-components/authenticator/customization)el inicio de sesion exija un doble factor de autenticacion, ademas no debe permitir la creacion de un usuario desde la interfaz (Solo usuario autenticados deben poder iniciar sesion). Adicionalmente cambia el tema del login para que incluya los colores y la personalizacion de PurpleLab, incluyendo el logo de la compania.
5. Posteriormente a esto necesito que analices el docuemnto de EstructDB-OTS Process.md que contiene la descripcion y documentacion de la informacion relacionada con los tipos de datos que se buscan clasificar con esta aplicacion (Puedes revisar un caso de existo de esto en este link https://www.businesswire.com/news/home/20250612704238/en/PurpleLab-and-Comscore-Partner[…]he-Shelf-Healthcare-Predictive-Audiences-in-The-Trade-Desk  https://www.businesswire.com/news/home/20250612704238/en/PurpleLab-and-Comscore-Partner-to-Deliver-Off-the-Shelf-Healthcare-Predictive-Audiences-in-The-Trade-Desk   ), esta aplicacion no gestiona el proceso pero si genera o centraliza la configuracion. Lo que necesito es que intentes plantear una primera estructura de base de datos con dynamodb que muestre los campos en cada tabla y sus respectivas relaciones entre tablas, para esto debes crear el recurso con amplify. 
6. Crea un menu lateral izquierdo con los siguientes opciones 
audiences
destinations
bridges
tenants
concept_groups
onboarding_requirements
metadata_requirements
external_buckets
6. Posterior a esta construccion del modelo de datos, necesito que usando los componentes reutilizables que previamente creaste construyas un modelo de vista reutilizable generico para ver, crear, visualizar y eliminar un recurso asociado a cada tabla audiences
audiences
destinations
bridges
tenants
concept_groups
onboarding_requirements
metadata_requirements
external_buckets
