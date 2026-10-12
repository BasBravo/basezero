---
title: "De ejecutar tareas a responder por el resultado"
description: "Cuando la IA hace la ejecución más rápida, lo que más valor gana en el trabajo de un desarrollador es saber hacia dónde va y comprobar que llega."
date: "2026-07-03"
author: "Bas Bravo"
locale: "es"
category: "Desarrollo"
keywords: ["desarrollo de software con IA", "trabajo por resultados", "rol del desarrollador", "criterio técnico", "equipos de producto"]
---

Un ticket pide añadir recordatorios automáticos a una herramienta para aprobar compras. La tarea parece clara: programar el envío, escribir el mensaje y anotar cuándo se envía. Con ayuda de la IA, un desarrollador puede tenerlo listo en muy poco tiempo.

El código puede ser perfecto y, aun así, no mejorar nada.

Quizá las solicitudes se quedan paradas porque llegan sin la información necesaria. O se asignan a alguien que está de vacaciones. O nadie sabe quién debe decidir. Otro correo no acorta la espera; solo añade ruido a un proceso que sigue roto.

Durante años hemos organizado el desarrollo alrededor de tareas: hacer una pantalla, crear un servicio, corregir un error. La IA hace cada una de ellas más rápida. Pero cuanto menos cuesta ejecutar una solución, más importa haber elegido bien el problema y saber reconocer cuándo se ha resuelto.

**El desarrollador sigue necesitando técnica. Lo que cambia es dónde la aplica: ya no solo para cumplir una instrucción, sino para responder, junto al equipo, por el resultado.**

![Un tren que sale por una vía con dos ramales: solo uno lleva a la estación de la bandera.](figure:rails)

---

## Terminar una tarea no es lo mismo que avanzar

Hay datos de que la IA acelera partes del trabajo. Un estudio publicado en *Management Science*, con casi 5.000 desarrolladores de tres grandes empresas, vio que quienes tenían un asistente de código completaban un 26 % más de tareas, aunque el efecto cambió de un experimento a otro.[^1]

También hay resultados en sentido contrario. A principios de 2025, METR observó que 16 desarrolladores con experiencia tardaban un 19 % más al usar IA en proyectos que conocían bien. Al intentar repetir la medición con herramientas más recientes, el propio equipo explicó que ya no podía estimar el efecto con fiabilidad.[^2]

Contar tareas terminadas responde a una pregunta concreta. No dice si la gente decide más rápido, si hay menos errores o si el producto es mejor. Escribir código, cerrar tickets o abrir cambios son señales de movimiento. El resultado se ve en cómo se comporta el producto y en lo que cambia para las personas.

## La técnica no pierde valor, cambia de sitio

Decir que ahora importa más el criterio puede sonar a que entender el software es opcional. Es justo lo contrario.

Si una propuesta llega en segundos, hay que saber ver si rompe una regla de seguridad, repite una lógica que ya existe, ralentiza todo o solo funciona en el caso ideal. Para delegar bien hay que saber explicar los límites; para revisar bien, entender qué debería pasar y qué podría fallar.

En la encuesta de Stack Overflow de 2025, el 66 % de quienes usaban IA señalaba como frustración recibir soluciones casi correctas, pero no del todo.[^3] Generar reduce el esfuerzo de escribir. No elimina el trabajo de comprender, encajar y responder por lo que se entrega.

Lo que pierde valor no es saber programar, sino ser la única persona que teclea cada detalle. Recordar una sintaxis diferencia menos. Entender cómo funciona un sistema, decidir sus límites, investigar un fallo y valorar qué compensa, eso sigue siendo técnica, y la IA lo amplía: tanto para quien sabe evaluar el resultado como para quien todavía no sabe dónde está el error.

## Pasar de una instrucción a un objetivo

Una tarea dice qué hacer. Un objetivo dice qué queremos que cambie. Hacen falta los dos, pero no deberían ocupar el mismo sitio.

Si empezamos por la tarea («añadir recordatorios automáticos»), la solución ya viene elegida y el trabajo termina cuando el cambio funciona y se publica. Si empezamos por el objetivo («reducir el tiempo que una solicitud válida espera una decisión»), todavía podemos comparar opciones, pensar en el camino completo y comprobar si algo cambió de verdad. Además, la IA puede ayudar a investigar, proponer y probar dentro de unos límites, y lo aprendido llega a la siguiente decisión.

No todo ticket necesita una reflexión estratégica. Cambiar un texto equivocado o actualizar una dependencia puede seguir siendo una tarea directa. El problema aparece cuando aplicamos esa misma lógica a decisiones que esconden dudas sobre las personas, el proceso o el negocio.

Incluso un buen objetivo necesita precisión. ¿Queremos mejorar la media o evitar los casos más lentos? ¿Cuentan solo las solicitudes completas? ¿Qué plazo tendría valor? Algo así ya se puede discutir:

> Reducir de tres días a uno el tiempo típico de decisión de las solicitudes completas, sin aumentar los reenvíos ni las notificaciones ignoradas.

Las cifras son un ejemplo, pero hacen visible el criterio. Y el recordatorio pasa de ser *el trabajo* a ser *una opción*.

## Ver el conjunto no es hacerlo todo

Mirar el producto de forma global no convierte al desarrollador en responsable de la estrategia, la investigación, el diseño, las ventas y el soporte. Cada una de esas disciplinas necesita su propia experiencia.

Ver el conjunto es entender cómo encaja una decisión técnica con el resto, y saber cuándo preguntar a otra persona. Concretamente, tener presentes cinco cosas:

- **La persona:** qué intenta conseguir y qué se lo impide hoy. Se contrasta con diseño, soporte y las propias personas usuarias.
- **El producto:** qué comportamiento queremos cambiar y qué haría que valiera la pena seguir. Se contrasta con producto y negocio.
- **La experiencia:** cómo se descubre, se entiende y se completa el camino, y cómo se recupera uno de un error. Se contrasta con diseño y accesibilidad.
- **El sistema:** datos, permisos, fallos, rendimiento y facilidad para cambiar después. Es terreno de ingeniería y seguridad.
- **El riesgo:** coste, límites legales y el daño que causaría un error. Se contrasta con dirección, legal y privacidad.

No se trata de tener la última palabra en cada una, sino de no actuar como si alguna no existiera. La IA multiplica lo que se puede hacer y acorta el tiempo para equivocarse de rumbo; trabajar en equipo es lo que mantiene el contexto mientras las opciones se multiplican.

## El criterio no es intuición con canas

El criterio puede parecer algo misterioso. Pero no consiste en acertar por instinto: consiste en decidir según la evidencia que hay, hacer visibles las suposiciones y saber qué resultado nos haría cambiar de idea.

Un estudio presentado en CHI 2025, con 319 profesionales y 936 ejemplos de uso de IA, encontró que cuanta más confianza se tenía en la herramienta, menos pensamiento crítico se aplicaba. Y cuanta más confianza se tenía en el propio conocimiento de la tarea, más. El trabajo crítico no desaparecía: se movía hacia comprobar, integrar y supervisar.[^4]

Revisar no es mirar un cambio hasta que parezca razonable. Es poder explicar qué persigue, qué supone, qué alternativas se descartaron, qué límites no puede cruzar y cómo sabremos que funciona.

La IA puede buscar dependencias, detectar casos raros, comparar opciones y cuestionar un plan. Pero no conoce por sí sola los compromisos de la empresa, el riesgo que se acepta ni cuánto vale cada resultado. Si falta contexto, no se vuelve verdad porque la respuesta esté bien escrita.

## Un ciclo corto para trabajar por resultados

Pasar de tareas a objetivos no exige procesos largos. Basta con un ciclo breve que mantenga unida la intención con lo que llega a producción.

![Un depósito con una marca de nivel y una fuga: verter cubos no basta si no se mira el nivel.](figure:tank)

Primero, **nombrar el cambio antes que la solución**: quién debería poder hacer algo que hoy no puede, o qué coste o riesgo queremos reducir. Si la respuesta solo describe una pantalla o una función, todavía estamos hablando de la solución. En el ejemplo, «enviar un recordatorio» pasa a ser «reducir el tiempo hasta una decisión».

Después, **reunir el contexto que podría cambiar la decisión**. No hace falta conocer todo el negocio, sino lo que haría inútil o peligrosa la solución: cómo llega la solicitud, qué información falta, qué pasa si alguien está ausente, qué datos son sensibles. La IA ayuda mucho a recorrer el código y resumir documentación. Hablar con quienes usan el proceso sigue haciendo falta para descubrir lo que nunca se escribió.

Luego, **elegir la intervención más pequeña que dé evidencia**. Quizá baste con avisar antes de los campos incompletos, reasignar durante una ausencia o crear una vista clara de pendientes. Quizá el recordatorio sí sea lo mejor. Con un objetivo claro se puede comparar el coste y lo fácil que es deshacerlo antes de decidir. Es la misma idea del artículo anterior, sobre [por qué construir ya no es el cuello de botella](/es/articulos/construir-ya-no-es-el-cuello-de-botella): merece la pena lo que reduce una duda real.

A continuación, **acordar qué debe cumplirse y solo entonces delegar**. Por ejemplo: una solicitud no se notifica dos veces, solo la persona adecuada la ve, una reasignación conserva el historial y un fallo del correo no bloquea el resto. Con eso claro, el trabajo se puede repartir entre personas y agentes según el riesgo. DORA recomienda cambios pequeños porque son más fáciles de revisar, probar e integrar, y los señala como una práctica que ayuda a convertir la velocidad de la IA en mejor producto y no en inestabilidad.[^5]

Por último, **cerrar el ciclo fuera del código**. Las pruebas confirman que el sistema hace lo acordado. Mirar después responde a otra pregunta: ¿sirvió? Medimos el tiempo hasta la decisión, pero también devoluciones, reenvíos y avisos ignorados. Si la espera sigue igual, habremos aprendido que el problema estaba en otro sitio. El error sería cerrar la tarea sin mirar.

## Lo que gana valor

Este cambio no elimina el oficio. Cambia qué partes del oficio marcan más diferencia:

- **Formular problemas comprobables**, separando la necesidad de la solución que alguien sugiere.
- **Entender cómo encajan las piezas** (interfaz, datos, permisos, operación y comportamiento humano), no solo producir código.
- **Poner límites a lo que se delega:** dar a la IA contexto, restricciones y una definición de éxito. Cuanto mayor el impacto o más difícil deshacerlo, más control.
- **Verificar a varias escalas:** una función, un recorrido completo y lo que ocurre ya en producción. Una prueba puede demostrar que se envió un correo, no que la decisión llegó antes.
- **Explicar las decisiones**, dejando claro qué sabemos y qué suponemos.
- **Aprender de la operación y de las personas:** mirar métricas, atender incidencias, observar usos inesperados.

## Hay casos donde la profundidad técnica pesa aún más

No todos los cambios permiten la misma amplitud. En criptografía, infraestructura, sistemas en tiempo real, migraciones críticas, seguridad o software que afecta a la salud, una visión general no sustituye al conocimiento especializado. Incluso en productos corrientes, el rendimiento, la accesibilidad o los permisos pueden concentrar el riesgo. Ver el conjunto sirve para detectarlo y acercar a la persona adecuada.

Para quien empieza, la IA puede dar una solución antes de que exista la comprensión para evaluarla. Pedir explicaciones, comparar enfoques y comprobar predicciones acelera el aprendizaje. Aceptar cada propuesta porque «funciona» tapa las lagunas.

## El equipo también tiene que permitirlo

No podemos pedir a alguien que responda por resultados si solo recibe soluciones cerradas, no tiene acceso a las personas usuarias ni a los datos y se le mide por lo rápido que vacía una lista.

Marty Cagan distingue entre equipos de entrega, que reciben funciones y entregan, y equipos de producto, que reciben problemas y responden por lo que cambia.[^6] Es una forma de organizarse, no algo que aparezca solo por instalar herramientas de IA.

De hecho, acelerar a cada persona puede aumentar la descoordinación. En el *State of Teams 2026* de Atlassian, el 89 % de los ejecutivos decía que la IA aumentaba la velocidad, pero solo el 6 % podía señalar un retorno claro en toda la organización.[^7] La encuesta viene de una empresa de herramientas de colaboración, así que conviene leerla como una señal. La tensión, aun así, es reconocible: producir más crea más decisiones, revisiones y dependencias si el objetivo compartido no mejora.

Trabajar por resultados necesita objetivos que se puedan observar, acceso al contexto, libertad para cuestionar la solución, cambios fáciles de deshacer, responsabilidad clara sobre el riesgo y tiempo para mirar qué pasó después de publicar. La autonomía sin contexto produce apuestas sueltas. El contexto sin autonomía produce ejecutores mejor informados. Hacen falta las dos.

## Siete preguntas antes de la siguiente tarea

No necesitan respuestas largas. Hacerlas ya cambia la conversación.

- ¿Qué resultado queremos cambiar y para quién?
- ¿Qué señal nos dirá si ha cambiado?
- ¿Qué parte de la petición es una necesidad y cuál es una solución propuesta?
- ¿Qué contexto podría invalidarla?
- ¿Qué podemos delegar y qué necesita criterio especializado?
- ¿Qué debe demostrar el cambio antes de publicarse?
- ¿Quién mirará el resultado y decidirá el siguiente paso?

No se trata de añadir siete casillas a cada ticket, sino de evitar que la velocidad de implementación nos quite el tiempo que necesitábamos para pensar.

Los buenos desarrolladores nunca se limitaron a escribir código: también encontraban contradicciones y consecuencias que la especificación no veía. La IA hace más visible ese valor. No nos pide dejar la técnica para volvernos generalistas superficiales, sino combinar profundidad con contexto, usar la IA como capacidad delegada y mantener la responsabilidad humana sobre la dirección y el resultado.

Antes de aceptar el siguiente ticket tal como está escrito, merece la pena preguntar:

> Si hacemos esta tarea exactamente como se ha pedido, ¿qué resultado habrá cambiado y cómo lo sabremos?

Si no tenemos respuesta, la tarea todavía no está lista. Si la tenemos, la IA puede ayudarnos a llegar antes. Pero seguir sabiendo adónde vamos continúa siendo nuestro trabajo.

[^1]: [Cui et al., *The Effects of Generative AI on High-Skilled Work: Evidence from Three Field Experiments with Software Developers*](https://doi.org/10.1287/mnsc.2025.00535), *Management Science*, estudio con 4.867 desarrolladores y herramientas de completado de código.
[^2]: [METR, *We are Changing our Developer Productivity Experiment Design*](https://metr.org/blog/2026-02-24-uplift-update/), actualización que explica tanto el resultado de 2025 como los límites para estimar el efecto de herramientas más recientes.
[^3]: [Stack Overflow, *Developer Survey 2025: AI*](https://survey.stackoverflow.co/2025/ai), resultados sobre adopción, confianza y frustraciones de quienes utilizan herramientas de IA en desarrollo.
[^4]: [Lee et al., *The Impact of Generative AI on Critical Thinking*](https://doi.org/10.1145/3706598.3713778), CHI 2025, encuesta a 319 profesionales del conocimiento con 936 ejemplos de uso.
[^5]: [DORA, *Working in small batches*](https://dora.dev/capabilities/working-in-small-batches/), práctica actualizada con resultados del estudio de desarrollo asistido por IA de 2025.
[^6]: [Marty Cagan, *Product vs. Feature Teams*](https://www.svpg.com/product-vs-feature-teams/), Silicon Valley Product Group.
[^7]: [Atlassian Teamwork Lab, *The State of Teams 2026*](https://www.atlassian.com/blog/state-of-teams-2026), encuesta global a 12.035 profesionales del conocimiento y 173 ejecutivos.
