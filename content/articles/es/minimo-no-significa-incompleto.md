---
title: "Mínimo no significa incompleto"
description: "Cómo reducir el alcance de un MVP sin romper la experiencia, esconder riesgos ni perder aquello que queríamos aprender al construirlo."
date: "2026-08-19"
author: "Bas Bravo"
locale: "es"
category: "Producto"
---

Hay una escena que se repite al empezar un producto. Sobre la mesa aparece una lista larga de funciones: cuentas, filtros, notificaciones, pagos, roles, integraciones. Alguien recuerda que estamos definiendo un MVP y propone pasar la mitad a una segunda fase. El documento queda más corto y durante un momento parece que el alcance está resuelto.

Casi nunca lo está.

Quitar funciones no garantiza que hayamos encontrado un producto más pequeño. A veces solo deja el mismo producto a medio hacer: pantallas sueltas, un recorrido interrumpido o la ausencia de aquello que permitía confiar en el resultado.

Para mí, definir un buen MVP consiste en **reducir la superficie del producto sin reducir su responsabilidad**. Elegir una persona, una situación y un resultado concretos; acompañarlos de principio a fin; y dejar fuera lo que todavía no sea necesario para comprobar si esa relación tiene valor.

![Un circuito esencial completo ocupa un perímetro reducido mientras las ampliaciones opcionales quedan fuera.](/articles/minimo-no-significa-incompleto/alcance-completo-diagrama.png "Reducir superficie no consiste en dejar el producto a medio construir, sino en proteger un recorrido completo dentro de un alcance menor.")

---

## El alcance no es una lista de funciones

Una lista coloca cada función al mismo nivel, aunque no cumplan el mismo papel ni tengan el mismo coste si faltan. Los permisos pueden ser invisibles y determinar si el producto admite datos reales. Un error quizá no aparezca en una demostración, pero será la interfaz que vea alguien cuando algo falle.

Por eso prefiero pensar el alcance como un recorrido. Un producto empieza cuando una persona llega con una intención y termina cuando obtiene un resultado, entiende qué ha ocurrido y sabe qué puede hacer después.

Imaginemos una herramienta para aprobar compras con tipos de solicitud, reglas, comentarios, avisos, métricas y exportaciones. Ordenar la lista genera una discusión interminable. Dibujar el recorrido básico produce algo más útil:

1. una persona crea una solicitud con la información necesaria;
2. la persona responsable puede revisarla;
3. toma una decisión;
4. quien la creó conoce el resultado.

![Una infraestructura continua conecta la creación, la revisión, la decisión y el retorno del resultado.](/articles/minimo-no-significa-incompleto/recorrido-esencial-diagrama.png "El recorrido esencial no termina al tomar una decisión: devuelve el resultado a quien inició el proceso.")

Podemos empezar con un solo tipo de solicitud, cargar responsables manualmente y posponer los paneles. No podemos eliminar la separación entre quien solicita y quien aprueba si la decisión necesita control. Tampoco podemos omitir qué sucede al rechazar o qué ve alguien si la solicitud ya fue resuelta.

El recorte deja de ser una negociación sobre preferencias y pasa a responder una pregunta más precisa:

> ¿Qué necesita este recorrido para ser verdadero?

## Producto, prototipo y primera versión no son lo mismo

Parte de la confusión viene de llamar MVP a cosas distintas. Un prototipo comprueba una interacción, una dirección visual o una incertidumbre técnica en condiciones controladas. Puede utilizar datos ficticios y operaciones manuales ocultas.

Un producto se enfrenta a condiciones menos amables. La persona entra sola, se equivoca, vuelve otro día, utiliza datos que importan y espera que el sistema recuerde lo ocurrido. Aunque sea pequeño, asume otra responsabilidad.

Y Combinator describe el MVP como un producto real que sus usuarios perciben como una experiencia terminada, aunque su función sea acotada.[^1] Marty Cagan añade tres condiciones útiles: debe aportar valor, poder utilizarse y ser viable para el equipo que lo entrega.[^2]

No merece la pena discutir demasiado la etiqueta. Sí conviene declarar si estamos construyendo:

- una prueba para aprender sobre una necesidad;
- un prototipo para resolver una incertidumbre;
- un piloto acompañado con pocas personas;
- o una primera versión autónoma que entrará en su trabajo.

Cada formato admite atajos distintos. El problema aparece cuando presentamos como producto lo que solo funciona como demostración.

## Lo mínimo está en la superficie, no en el cuidado

Cuando se habla de un MVP rápido, calidad suele confundirse con cantidad. Es razonable posponer personalización o automatizaciones sofisticadas. No lo es que la persona no sepa si su acción se ha guardado. Es razonable diseñar un recorrido principal. No lo es guardar datos sensibles sin saber quién puede verlos.

Una primera versión no necesita el acabado de un producto maduro en toda su superficie. Necesita intención en los puntos que sostienen su promesa. Yo separo esa base en cuatro capas:

| Capa | Pregunta | Ejemplos |
| --- | --- | --- |
| **Valor** | ¿Puede alcanzar el resultado principal? | Crear, decidir, recibir o completar aquello que vino a hacer. |
| **Comprensión** | ¿Entiende qué ocurre y qué puede hacer? | Jerarquía, contenido, estados, confirmaciones y errores. |
| **Confianza** | ¿Puede usarlo con consecuencias reales? | Permisos, privacidad, integridad, accesibilidad y recuperación. |
| **Aprendizaje** | ¿Sabremos si la hipótesis se sostiene? | Señales de uso, contexto cualitativo y criterio para decidir. |

Si una pieza no fortalece ninguna capa, es candidata para quedar fuera. Si sostiene una, eliminarla exige algo más que llamarla “detalle”. La profundidad necesaria depende del riesgo: no es igual organizar referencias visuales que gestionar pagos o información médica. Lo importante es hacerlo explícito y responder de forma proporcional.

## Cuatro maneras de hacer un producto más pequeño

Cuando el alcance no cabe, quitar pantallas suele ser el último recurso. Hay recortes más eficaces que conservan el recorrido completo.

### 1. Reducir para quién se construye

Servir a “equipos” obliga a resolver diferencias de responsabilidad, tamaño y contexto. Empezar por quien coordina un equipo pequeño permite decidir con más claridad.

### 2. Reducir la situación

Una herramienta puede cubrir todo un proceso o empezar por el caso más frecuente. Las restricciones bien elegidas ahorran desarrollo y mejoran la comprensión. La flexibilidad temprana traslada decisiones al usuario antes de que sepamos cuáles son buenas.

### 3. Reducir la variabilidad

Un rol, una plantilla, un idioma o una integración pueden bastar. Cada variante multiplica estados, permisos, contenido, pruebas y soporte. Reducirlas estrecha el marco sin romper el recorrido.

### 4. Reducir la automatización

No todo necesita automatizarse desde el primer día. El equipo puede revisar altas o resolver excepciones mientras el volumen lo permita. Lo manual compra aprendizaje si no compromete datos ni promete una capacidad inexistente.

Una operación manual también necesita un procedimiento: quién la realiza, cuánto tarda y qué ocurre si no está disponible. De otro modo no hemos reducido el producto; solo hemos movido una parte fuera de plano.

## Poner límites y decidir qué queremos aprender

Un alcance se estabiliza con exclusiones explícitas: “no importaremos el histórico”, “las solicitudes no se editan” o “el piloto será solo en español”. Evitan que los casos descartados regresen como pequeños ajustes.

*Shape Up* llama *appetite* a decidir cuánto tiempo merece una idea y trabaja con tiempo fijo y alcance variable.[^3] El límite participa así en la forma del producto, aunque todavía hace falta una jerarquía:

1. proteger el resultado principal;
2. proteger la comprensión y la confianza necesarias;
3. resolver la incertidumbre más arriesgada;
4. simplificar variantes y operación;
5. aplazar comodidad, escala y optimización.

También necesitamos una pregunta más concreta que “validar la idea”:

> ¿Un responsable de operaciones utilizará esta herramienta cada semana para aprobar solicitudes reales sin volver a coordinarlas por correo?

Así podemos observar solicitudes, decisiones, recurrencia y pasos que salen de la herramienta. También reconocer evidencia negativa: si todos entran una vez y vuelven al correo, otro panel no resolverá el problema.

Interés, uso y adopción son señales distintas. En la encuesta europea de Slush de 2025, el 68 % de los fundadores decía identificar posibles clientes con facilidad, pero solo el 30 % encontraba fácil convertirlos.[^4] La versión debe dejar claro qué señal estamos buscando y qué decisión tomaremos después.

## La IA ha hecho más fácil construir de más

Hoy podemos pasar de una descripción a una interfaz funcional muy rápido. Es una ventaja enorme para explorar y reducir incertidumbre técnica. También crea una tentación: si añadir algo parece barato, dejarlo fuera parece una pérdida.

El coste visible de una función ha bajado, pero todavía hay que integrarla, decidir estados, probarla y mantenerla.

En *State of Startups 2026* de Supabase, la complejidad técnica cayó del 24 % al 11 % como reto principal, por detrás de adquisición y product-market fit.[^5] La muestra está vinculada a un proveedor, pero señala algo útil: poder construir no demuestra que merezca existir.

DORA llegó a una conclusión compatible al estudiar a casi cinco mil profesionales: la IA amplifica las capacidades y los problemas que ya tiene una organización.[^6] Con un alcance claro acelera la entrega. Con una dirección confusa produce más confusión en menos tiempo.

Mi respuesta no es usar menos IA, sino elevar el nivel de la decisión que la precede. Cuando generar otra variante cuesta minutos, el criterio para escoger una importa todavía más.

## Un método sencillo para recortar alcance

No utilizo una fórmula rígida, pero este proceso suele revelar pronto dónde está el peso innecesario.

### 1. Escribir el cambio esperado

> Para **[una persona]**, en **[una situación]**, el producto permite **[obtener un resultado]** sin **[la fricción actual]**.

Si necesitamos unir varias frases con “y”, probablemente hay más de un producto compitiendo por entrar.

### 2. Dibujar el recorrido completo

Entre cinco y siete pasos bastan. No son pantallas, sino cambios que la persona intenta producir, incluido cómo sabe que ha terminado.

### 3. Nombrar la pregunta más arriesgada

¿Dudamos de la necesidad, la adopción, la comprensión o la viabilidad? La primera versión no debe responderlo todo con la misma fuerza.

### 4. Clasificar cada elemento

- **Núcleo:** sin esto no existe el resultado principal.
- **Confianza:** sin esto no deberíamos pedir uso real.
- **Manual:** puede hacerlo el equipo temporalmente y con responsabilidad.
- **Después:** aporta comodidad, escala o variedad, pero no cambia la pregunta.

### 5. Escribir qué no entra

Los límites deben poder discutirse. Si una exclusión amenaza el valor central, se verá antes de construir; si es aceptable, protegerá al equipo cuando reaparezca.

### 6. Definir la señal y la siguiente decisión

Definir qué observaremos, durante cuánto tiempo y qué haremos con cada respuesta. Sin ese paso, el aprendizaje se convierte en comentarios y el alcance vuelve a crecer.

## Pequeño no significa provisional

Hay decisiones cuyo coste aumenta mucho después del lanzamiento: permisos, propiedad de los datos, eliminación de información, estructura semántica o identificación de errores. No siempre necesitan una solución sofisticada. Necesitan que alguien las haya pensado.

La protección de datos desde el diseño exige preguntarse para qué recogemos cada dato, quién lo necesita y cuánto tiempo debe existir.[^7] Accesibilidad significa no introducir barreras evitables en el recorrido esencial.

Mi criterio es sencillo: si un atajo puede invalidar el aprendizaje, dañar a la persona o hacer muy costoso cambiar después, no es un buen recorte. Si reduce variedad o comodidad sin romper el resultado, probablemente sí.

Un MVP no necesita parecer grande. Necesita tener una razón clara para ser pequeño. Puede incluir trabajo manual, pocas opciones y decisiones temporales. Lo que no debería incluir es dejadez accidental presentada como velocidad.

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
