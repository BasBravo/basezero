---
title: "Mínimo no significa incompleto"
description: "Cómo reducir el alcance de un MVP sin romper la experiencia, esconder riesgos ni perder aquello que queríamos aprender al construirlo."
date: "2026-08-19"
author: "Bas Bravo"
locale: "es"
category: "Producto"
---

Hay una escena que se repite al empezar un producto. Sobre la mesa aparece una lista larga de funciones: cuentas de usuario, panel de administración, filtros, notificaciones, pagos, exportaciones, roles, integraciones. Alguien recuerda que estamos definiendo un MVP y propone pasar la mitad de la lista a una segunda fase. El documento queda más corto y durante un momento parece que el alcance está resuelto.

Casi nunca lo está.

Quitar funciones no garantiza que hayamos encontrado un producto más pequeño. A veces solo deja el mismo producto a medio hacer. Conservamos pantallas sueltas, interrumpimos el recorrido principal o eliminamos precisamente aquello que permitía confiar en el resultado. La fecha se acerca, la lista se reduce, pero lo que queda ya no cuenta una historia completa.

Para mí, definir un buen MVP consiste en otra cosa: **reducir la superficie del producto sin reducir su responsabilidad**. Elegir una persona, una situación y un resultado concretos; acompañarlos de principio a fin; y dejar fuera todo lo que todavía no sea necesario para comprobar si esa relación tiene valor.

La diferencia parece pequeña. En la práctica cambia casi todas las decisiones de alcance.

## El alcance no es una lista de funciones

Una lista coloca cada función al mismo nivel. “Añadir comentarios” ocupa una línea; “gestionar permisos” también. Sin embargo, no cumplen el mismo papel ni tienen el mismo coste si faltan.

Los permisos pueden ser invisibles y, aun así, determinar si el producto se puede usar con datos reales. Los comentarios pueden parecer importantes durante una conversación y resultar prescindibles durante meses. Un estado de error quizá no aparezca en ninguna demostración, pero será la única interfaz que vea una persona cuando algo falle.

Por eso prefiero pensar el alcance como un recorrido, no como un inventario. Un producto empieza cuando alguien llega con una intención y termina cuando esa persona obtiene un resultado, entiende qué ha ocurrido y sabe qué puede hacer después. Entre ambos puntos hay decisiones, datos y cambios de estado. Esa secuencia permite distinguir lo esencial de lo accesorio mucho mejor que una columna de prioridades.

Imaginemos una herramienta interna para aprobar solicitudes de compra. El documento inicial podría incluir:

- varios tipos de solicitud;
- reglas configurables por departamento;
- comentarios y menciones;
- notificaciones por correo y Slack;
- paneles con métricas;
- exportación a contabilidad;
- histórico de actividad;
- sustituciones durante vacaciones.

Si ordenamos esa lista por importancia, seguramente discutiremos durante horas. Si dibujamos el recorrido más básico, aparece algo más manejable:

1. una persona crea una solicitud con la información necesaria;
2. la persona responsable puede revisarla;
3. toma una decisión;
4. quien la creó conoce el resultado.

Ese recorrido todavía no define toda la solución, pero ya contiene una unidad de valor. Podemos reducir los tipos de solicitud a uno, cargar responsables manualmente, enviar una única clase de aviso y posponer los paneles. No podemos quitar la separación entre quien solicita y quien aprueba si la decisión necesita control. Tampoco podemos omitir qué sucede al rechazar o qué ve alguien si la solicitud ya fue resuelta.

El recorte deja de ser una negociación sobre preferencias. Pasa a ser una pregunta más precisa: **¿qué necesita este recorrido para ser verdadero?**

## Producto, prototipo y primera versión no son lo mismo

Parte de la confusión viene de llamar MVP a cosas muy distintas.

Un prototipo puede comprobar si una interacción se entiende, si una dirección visual funciona o si una tecnología es capaz de producir un resultado. Puede contener datos ficticios, caminos preparados y operaciones que suceden manualmente detrás de la pantalla. Está construido para responder una pregunta en condiciones controladas.

Un producto se enfrenta a condiciones menos amables. La persona entra sin que estemos a su lado, se equivoca, vuelve otro día, utiliza datos que importan y espera que el sistema recuerde lo ocurrido. Aunque sea pequeño, tiene una responsabilidad que el prototipo no necesita asumir.

La distinción no es nueva. Y Combinator describe el MVP como un producto real que sus usuarios perciben como una experiencia terminada, aunque su función sea muy acotada.[^1] Marty Cagan añade tres condiciones útiles: debe aportar valor, poder utilizarse y ser viable para el equipo que lo entrega.[^2]

No creo que merezca la pena discutir demasiado la etiqueta. Sí merece la pena declarar qué estamos construyendo:

- una prueba para aprender sobre una necesidad;
- un prototipo para resolver una incertidumbre de diseño o tecnología;
- un piloto acompañado con pocas personas;
- o una primera versión autónoma que empezará a formar parte de su trabajo.

Cada formato admite atajos distintos. El problema aparece cuando se presenta como producto lo que solo funciona como demostración, o cuando se exige a un prototipo toda la infraestructura que necesitaría un servicio consolidado.

## Lo mínimo está en la superficie, no en el cuidado

Cuando se habla de un MVP “rápido”, calidad suele confundirse con cantidad.

Es razonable posponer la personalización, las automatizaciones sofisticadas o una interfaz capaz de cubrir diez perfiles distintos. No es razonable que la persona no entienda si su acción se ha guardado. Es razonable empezar con una operación manual. No lo es guardar datos sensibles sin saber quién puede verlos. Es razonable diseñar un único recorrido principal. No lo es impedir que alguien lo complete con teclado cuando se podía evitar desde el principio.

Una primera versión no necesita el acabado de un producto maduro en toda su superficie. Necesita intención en los puntos que sostienen su promesa.

Yo suelo separar esa base en cuatro capas:

| Capa | Pregunta | Ejemplos |
| --- | --- | --- |
| **Valor** | ¿Puede la persona alcanzar el resultado principal? | Crear, decidir, recibir o completar aquello que vino a hacer. |
| **Comprensión** | ¿Entiende qué está pasando y qué puede hacer? | Jerarquía, contenido, estados vacíos, confirmaciones y errores. |
| **Confianza** | ¿Puede usarlo con consecuencias reales? | Permisos, privacidad, integridad de datos, accesibilidad y recuperación. |
| **Aprendizaje** | ¿Sabremos si la hipótesis se sostiene? | Señales de uso, contexto cualitativo y un criterio para decidir después. |

Si una pieza no fortalece ninguna de estas capas, es una buena candidata para quedar fuera. Si una pieza sostiene una de ellas, eliminarla exige algo más que llamarla “detalle”.

Esto no significa construir cada capa con la misma profundidad. La confianza necesaria para una herramienta que organiza referencias visuales no es la misma que para una aplicación que recomienda candidatos, gestiona pagos o almacena información médica. Lo importante es hacer explícito el riesgo y responder de forma proporcional.

## Cuatro maneras de hacer un producto más pequeño

Cuando el alcance no cabe, quitar pantallas suele ser el último recurso, no el primero. Hay recortes más eficaces.

### 1. Reducir para quién se construye

Servir a “equipos” obliga a resolver diferencias de responsabilidad, tamaño, contexto y lenguaje. Servir primero a la persona que coordina un equipo pequeño permite tomar decisiones más claras.

Elegir un perfil inicial no implica que el resto no importe. Significa que todavía no estamos dispuestos a empeorar el producto principal para acomodar necesidades que no hemos observado bien.

### 2. Reducir la situación

Una herramienta puede gestionar todos los casos de un proceso o empezar por el más frecuente y predecible. Una plataforma de vídeo interactivo puede admitir cualquier estructura imaginable o resolver primero un tipo de recorrido con restricciones claras.

Las restricciones bien elegidas no solo ahorran desarrollo. Hacen que el producto sea más fácil de entender. La flexibilidad temprana suele trasladar decisiones al usuario antes de que nosotros mismos sepamos cuáles son buenas.

### 3. Reducir la variabilidad

Un solo rol, una plantilla, un idioma, una integración o una forma de pago pueden ser suficientes para aprender. Cada variante multiplica estados, permisos, contenido, pruebas y soporte. Lo que en un documento parece una opción más puede atravesar todo el sistema.

Este tipo de reducción es especialmente valioso porque mantiene completo el recorrido. La persona puede llegar hasta el final; simplemente lo hace dentro de un marco más estrecho.

### 4. Reducir la automatización

No todo lo que ocurre detrás de una interfaz necesita estar automatizado desde el primer día. Se pueden revisar altas, preparar configuraciones, clasificar entradas o resolver excepciones manualmente mientras el volumen lo permita.

Lo manual es útil cuando compra aprendizaje y se ha diseñado conscientemente. Deja de serlo cuando oculta un coste imposible, compromete datos o hace creer al usuario que existe una capacidad que el equipo no puede sostener.

Una operación manual también necesita un procedimiento: quién la realiza, cuánto tarda, qué ocurre si no está disponible y qué información puede consultar. De otro modo no hemos reducido el producto; solo hemos movido una parte fuera de plano.

## Decidir también qué no se va a resolver

Un alcance se vuelve mucho más estable cuando incluye exclusiones explícitas.

“No habrá equipos con más de un administrador.” “No importaremos el histórico.” “Las solicitudes no se pueden editar después de enviarse.” “El primer piloto será solo en español.” Son decisiones incómodas, pero evitan que los casos descartados vuelvan disfrazados de pequeños ajustes durante el desarrollo.

Shape Up llama *appetite* a decidir cuánto tiempo merece una idea antes de diseñar la solución y trabaja con tiempo fijo y alcance variable.[^3] Me interesa de ese enfoque que obliga a tratar el límite como una restricción creativa. El tiempo no aparece al final para valorar una solución ya imaginada; participa en su forma desde el principio.

Pero el tiempo, por sí solo, no sabe qué cortar. Para eso hace falta una jerarquía:

1. proteger el resultado principal;
2. proteger la comprensión y la confianza necesarias para obtenerlo;
3. resolver la incertidumbre más arriesgada;
4. simplificar variantes y operación;
5. aplazar comodidad, escala y optimización.

La jerarquía evita dos extremos bastante comunes: una primera versión tan amplia que nunca llega a usuarios y otra tan pobre que su rechazo no enseña nada sobre la idea original.

## Una versión debería intentar responder una pregunta

“Validar la idea” es demasiado amplio. Una idea puede contener decenas de suposiciones: que el problema ocurre con frecuencia, que una persona reconoce su coste, que puede adoptar otro proceso, que confía en el resultado o que está dispuesta a pagar.

No todas se comprueban construyendo software. Antes de desarrollar se pueden observar procesos, entrevistar a personas, simular una propuesta o prestar el servicio manualmente. La primera versión debería concentrarse en la incertidumbre que ya no podemos resolver de una forma más barata y que podría cambiar de verdad nuestra dirección.

Una buena pregunta se parece a esto:

> ¿Un responsable de operaciones utilizará esta herramienta cada semana para aprobar solicitudes reales sin volver a coordinarlas por correo?

Eso permite decidir qué medir: solicitudes creadas, decisiones completadas, recurrencia, pasos que salen de la herramienta y motivos. También permite reconocer evidencia negativa. Si todo el mundo entra una vez para verla y después vuelve al correo, añadir un panel más bonito probablemente no resolverá el problema.

La reacción verbal cuenta, pero el comportamiento pesa más. En la encuesta europea de Slush de 2025, el 68 % de los fundadores decía identificar posibles clientes con facilidad, mientras solo el 30 % encontraba fácil convertirlos.[^4] Interés, uso y adopción son señales distintas. El MVP debe dejar claro cuál estamos buscando.

## La IA ha hecho más fácil construir de más

En 2026 es posible pasar de una descripción a una interfaz funcional en muy poco tiempo. Esto es una ventaja enorme para explorar, comparar alternativas y quitar incertidumbre técnica. También introduce una tentación nueva: si añadir algo parece barato, dejarlo fuera parece una pérdida.

El coste visible de una función puede haber bajado, pero su coste completo no desaparece. Hay que integrarla en el recorrido, decidir sus estados, probarla, mantenerla y explicar cómo convive con el resto. Cada posibilidad añadida amplía el producto que necesitamos comprender.

La encuesta State of Startups 2026 de Supabase, realizada entre dos mil personas que construyen startups, ofrece una señal interesante: la complejidad técnica cayó del 24 % al 11 % como principal reto declarado, mientras adquisición de clientes y product-market fit siguieron por delante.[^5] Es una muestra vinculada a un proveedor y no representa por sí sola todo el mercado, pero describe bien el cambio de presión. Poder construir algo no responde a la pregunta de si merece existir.

DORA llegó a una conclusión compatible al estudiar a casi cinco mil profesionales: la IA funciona como un amplificador de las capacidades y de los problemas que ya tiene una organización.[^6] Con un alcance claro, acelera la exploración y la entrega. Con una dirección confusa, permite producir más confusión en menos tiempo.

Mi respuesta no es utilizar menos IA. Es elevar el nivel de la decisión que la precede. Cuando generar otra variante cuesta minutos, el criterio para escoger una importa todavía más.

## Un método sencillo para recortar alcance

No utilizo una fórmula rígida para todos los proyectos, pero este proceso suele revelar rápido dónde está el peso innecesario.

### 1. Escribir el cambio esperado en una frase

> Para **[una persona concreta]**, en **[una situación concreta]**, el producto permite **[obtener un resultado]** sin **[el coste o fricción actual]**.

Si necesitamos varias frases unidas por “y”, probablemente hay más de un producto compitiendo por entrar en la primera versión.

### 2. Dibujar el recorrido de principio a fin

Entre cinco y siete pasos suelen bastar. No son pantallas; son cambios que la persona intenta producir. Conviene incluir qué ocurre antes de entrar y cómo sabe que ha terminado.

### 3. Nombrar la pregunta más arriesgada

¿Dudamos de la necesidad, de la adopción, de la comprensión, de la viabilidad técnica o del modelo de negocio? Una primera versión no tiene por qué responderlas todas con la misma fuerza.

### 4. Clasificar cada elemento

- **Núcleo:** sin esto no existe el resultado principal.
- **Confianza:** sin esto no deberíamos pedir uso real en este contexto.
- **Manual:** puede hacerlo el equipo temporalmente y de forma responsable.
- **Después:** aporta comodidad, escala o variedad, pero no cambia la pregunta actual.

Esta clasificación es más útil que “imprescindible / deseable” porque obliga a explicar el papel de cada pieza.

### 5. Escribir los casos que no entran

Los límites deben poder leerse y discutirse. Si una exclusión amenaza el valor central, se verá antes de empezar a construir. Si es aceptable, protege al equipo cuando reaparezca más adelante.

### 6. Definir la señal y la siguiente decisión

Qué observaremos, durante cuánto tiempo y qué haríamos si la respuesta es positiva, ambigua o negativa. Sin ese último paso, el aprendizaje termina convertido en una colección de comentarios y el alcance vuelve a crecer por inercia.

## Lo que no conviene posponer

Hay decisiones cuyo coste aumenta mucho después del lanzamiento. El modelo de permisos, la propiedad de los datos, la posibilidad de eliminar información, la estructura semántica básica o la forma de identificar errores son algunos ejemplos.

No siempre requieren una solución sofisticada. Requieren que alguien los haya pensado.

La protección de datos desde el diseño, por ejemplo, no obliga a construir un sistema empresarial para cada piloto. Sí obliga a preguntarse para qué recogemos cada dato, quién lo necesita y cuánto tiempo debería existir.[^7] Del mismo modo, accesibilidad no significa revisar toda norma posible antes de mostrar un prototipo; significa no introducir barreras evitables en el recorrido que hemos decidido considerar esencial.

Mi criterio es sencillo: si un atajo puede invalidar el aprendizaje, dañar a la persona o hacer muy costoso cambiar después, no es un buen recorte. Si reduce variedad o comodidad sin romper el resultado, probablemente sí.

## La primera versión es una decisión, no una disculpa

Un MVP no necesita parecer grande. Necesita tener una razón clara para ser pequeño.

Cuando el alcance está bien definido, se nota. El producto no intenta esconder todo lo que todavía no hace. Sus límites son comprensibles, el recorrido principal llega hasta el final y el equipo sabe qué espera aprender. Puede haber trabajo manual, pocas opciones y decisiones temporales. No hay dejadez accidental presentada como velocidad.

Esta forma de trabajar exige renunciar a ideas buenas, al menos durante un tiempo. También exige integrar estrategia, diseño y tecnología desde el principio: muchas veces una interacción más simple elimina semanas de desarrollo; otras, una restricción técnica revela que habíamos formulado mal el problema. Separar esas conversaciones produce planes elegantes que luego no caben en la realidad.

La pregunta que utilizo al cerrar el alcance no es “¿podemos quitar algo más?”. Es esta:

> Si una persona completa esta versión, ¿habrá recibido valor suficiente y nosotros habremos aprendido algo que justifique la siguiente?

Si la respuesta es sí, probablemente tenemos una primera versión. Si solo hemos conseguido una lista más corta, todavía no.

[^1]: [Y Combinator, *Practical Design: MVP Spec*](https://www.ycombinator.com/blog/practical-design-mvp).
[^2]: [Marty Cagan, *Minimum Viable Product*](https://www.svpg.com/minimum-viable-product/), Silicon Valley Product Group.
[^3]: [Ryan Singer, *Set Boundaries*](https://basecamp.com/shapeup/1.2-chapter-03), en *Shape Up*.
[^4]: [Slush, *Startup Struggle Survey 2025*](https://impact.slush.org/startup-struggle-survey-2025.html), encuesta a 607 fundadores europeos early-stage.
[^5]: [Supabase, *State of Startups 2026*](https://supabase.com/state-of-startups). La encuesta declara dos mil participantes y debe interpretarse teniendo en cuenta su afinidad con el ecosistema del proveedor.
[^6]: [Google Research, *DORA 2025 State of AI-assisted Software Development*](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/).
[^7]: [Comisión Europea, principios de tratamiento de datos bajo el GDPR](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/principles-gdpr_en).
