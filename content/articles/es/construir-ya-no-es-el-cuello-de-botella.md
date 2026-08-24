---
title: "Construir ya no es el cuello de botella"
description: "Qué debe aprender una primera versión cuando producir software es más rápido, pero decidir qué merece convertirse en producto sigue siendo difícil."
date: "2026-08-24"
author: "Bas Bravo"
locale: "es"
category: "Producto"
---

Durante mucho tiempo, el primer gran obstáculo de un producto digital era conseguir que existiera. Hacían falta meses, un equipo amplio y bastante inversión antes de poder poner una idea delante de alguien.

Ese límite se ha movido. Hoy podemos describir un flujo, generar varias interfaces y tener una versión funcional en días. Es una ventaja enorme: nos permite explorar más y llegar antes a algo que se puede tocar.

Pero una aplicación que funciona no demuestra que haya un producto detrás. Demuestra, sobre todo, que hemos sido capaces de construirla.

Todavía necesitamos saber si el problema ocurre de verdad, a quién le importa lo suficiente, qué tendría que cambiar en su comportamiento y si podemos ofrecer la solución de forma responsable. **Cuando producir software cuesta menos, el criterio para decidir qué merece ser producido se convierte en el trabajo principal.**

![Varias llaves distintas están terminadas sobre una mesa, pero solo una encaja en la cerradura real.](/articles/construir-ya-no-es-el-cuello-de-botella/llaves-y-cerradura.png "Podemos fabricar muchas soluciones; la evidencia nos permite descubrir cuál encaja con el problema real.")

---

## Una aplicación que funciona solo responde a una pregunta

Imaginemos una herramienta que escucha las reuniones con clientes, identifica los acuerdos y prepara las tareas que debe hacer cada persona. En una demostración resulta convincente: reconoce voces, produce un resumen ordenado y envía las tareas al gestor del equipo.

Ya sabemos algo importante: la solución es técnicamente posible.

Sin embargo, aún no sabemos si los acuerdos se pierden con suficiente frecuencia, si esa pérdida tiene consecuencias, si alguien revisará el resumen, si el equipo confiará en él o si quien dirige la empresa querrá pagar por evitar el trabajo actual. Incluso podríamos haber resuelto bien una tarea que nadie necesitaba delegar.

Es fácil confundir el movimiento de la interfaz con el avance del producto. Una nueva pantalla ofrece una sensación inmediata de progreso. Una entrevista que contradice nuestra idea o una prueba en la que nadie vuelve a usarla puede parecer menos satisfactoria, aunque nos ahorre meses.

La primera versión no debería intentar demostrar que nuestra idea era buena. Debería ayudarnos a decidir si merece el siguiente paso.

## El cuello de botella se ha movido, no ha desaparecido

Construir buen software sigue necesitando trabajo. La IA no elimina la arquitectura, la seguridad, los estados inesperados ni la responsabilidad sobre el resultado. Tampoco convierte cada cambio generado en un cambio correcto.

En el estudio DORA de 2025, realizado con casi cinco mil profesionales, la IA aparece como un amplificador: mejora lo que ocurre en organizaciones con una dirección clara y también hace más visibles los problemas de aquellas que no la tienen.[^1] En la encuesta de Stack Overflow del mismo año, el 66 % de quienes respondieron señalaba como frustración encontrarse con soluciones de IA que estaban casi bien, pero no del todo.[^2]

La capacidad de producir ha crecido, pero verificar, integrar, elegir y mantener siguen formando parte del trabajo. Y aparece un riesgo nuevo: como cada intento parece barato, podemos acumular soluciones antes de haber entendido cuál de ellas merece sobrevivir.

Producir más no siempre significa avanzar más. Si diez versiones responden a la misma suposición sin ponerla a prueba, solo tenemos diez formas de seguir sin saber.

## Una idea suele esconder al menos cinco hipótesis

Cuando alguien dice “queremos validar la idea”, normalmente está agrupando dudas muy distintas. Yo prefiero separarlas en cinco hipótesis. No son una clasificación universal, pero suelen bastar para encontrar dónde está el riesgo de una primera versión.

| Hipótesis | Lo que tiene que ser cierto | Una señal útil |
| --- | --- | --- |
| **Problema** | La situación ocurre con suficiente frecuencia o gravedad. | Casos recientes, consecuencias visibles y soluciones improvisadas que ya cuestan tiempo, dinero o confianza. |
| **Persona** | Podemos identificar a quien vive el problema y a quien decide resolverlo. | Un grupo concreto comparte contexto, lenguaje, responsabilidades y una forma razonable de llegar hasta él. |
| **Propuesta** | El cambio que ofrecemos se entiende y resulta valioso. | La persona consigue el resultado, reconoce la mejora y prefiere esa dirección frente a su alternativa actual. |
| **Comportamiento** | La solución puede incorporarse a una rutina real. | Se utiliza sin nuestra insistencia, vuelve a utilizarse y desplaza al menos una parte del proceso anterior. |
| **Viabilidad** | Podemos sostener la promesa técnica y económicamente. | La calidad, el coste, los datos, la operación y el modelo de ingresos funcionan dentro de límites aceptables. |

En la herramienta de reuniones, una buena transcripción apoyaría la viabilidad técnica, pero no la hipótesis de comportamiento. Una lista de espera mostraría interés por la propuesta, pero no demostraría que el equipo va a revisar y compartir cada resumen. Un piloto usado con entusiasmo por quien coordina el proyecto tampoco probaría que la persona con presupuesto está dispuesta a comprarlo.

Cada evidencia tiene un alcance. El error no está en empezar con una señal pequeña, sino en pedirle que responda una pregunta para la que no sirve.

## La evidencia tiene que poder cambiar una decisión

Antes de preparar una prueba, conviene escribir qué haremos con el resultado. Si cualquier respuesta nos lleva a construir lo mismo, no estamos diseñando un experimento; estamos buscando una justificación.

Strategyzer propone hacer explícitos la hipótesis, la prueba, lo que mediremos y el umbral que utilizaremos para interpretar el resultado.[^3] A mí me falta añadir una última línea: qué decisión tomaremos después.

> Si esta prueba sale como esperamos, ¿qué nos atreveremos a hacer? Si no, ¿qué cambiaremos o dejaremos de hacer?

Esta pregunta evita los criterios que solo pueden crecer. “Queremos muchas visitas” no dice cuántas importan, quién debería llegar ni qué demostraría su llegada. “Queremos comentarios positivos” hace que un cumplido pese lo mismo que un cambio de comportamiento.

Una señal resulta útil cuando está cerca de la duda y tiene consecuencias. En orden aproximado, podemos observar:

- **lo que alguien opina:** ayuda a entender su lenguaje, sus expectativas y cómo interpreta una propuesta;
- **lo que recuerda haber hecho:** revela casos, frecuencia, alternativas y costes que podemos contrastar;
- **el compromiso que acepta:** dedicar tiempo, compartir un proceso, aportar datos o presentar la prueba a su equipo;
- **lo que hace en una situación real:** completar la tarea, volver, cambiar una costumbre o recomendar la solución;
- **el intercambio que está dispuesto a realizar:** pagar, firmar un piloto o asumir el coste de implantarla.

Lo que una persona hace suele aportar evidencia más fuerte que lo que dice que haría, pero una escala no convierte automáticamente una prueba en buena.[^4] Diez clics de personas equivocadas no valen más que una conversación que descubre quién toma realmente la decisión. La calidad depende de la pregunta, del contexto y de cuánto riesgo estamos a punto de asumir.

## El experimento más pequeño depende de la duda

No todas las hipótesis necesitan software. La guía de servicios digitales de GOV.UK recomienda entender el problema, las personas y las restricciones antes de comprometerse a construir; incluso contempla que la investigación muestre una solución mejor que crear un nuevo servicio.[^5]

Podemos elegir el formato según aquello que todavía no sabemos:

| Si dudamos de… | Podemos empezar con… | Queremos observar… |
| --- | --- | --- |
| **el problema** | entrevistas sobre casos recientes y observación del trabajo actual; | cuándo ocurre, qué consecuencias tiene y qué hace la persona hoy; |
| **la propuesta** | una historia clara, un prototipo o el resultado preparado manualmente; | si se entiende, si resuelve la tarea y qué alternativa prefiere; |
| **el comportamiento** | un piloto pequeño dentro del contexto real; | si se incorpora al trabajo, se repite y desplaza el método anterior; |
| **la viabilidad** | una prueba técnica, operativa o de datos centrada en el mayor riesgo; | calidad, límites, coste, fallos y capacidad de recuperación; |
| **el negocio** | una oferta concreta con precio, condiciones y siguiente paso; | si la persona adecuada compromete presupuesto y tiempo. |

Las entrevistas sirven para descubrir problemas, pero conviene hablar de hechos y no pedir predicciones. “Cuéntame la última vez que se perdió un acuerdo” ofrece más información que “¿usarías una herramienta que organiza tus reuniones?”. Y Combinator recomienda observar a las personas en el lugar donde aparece la necesidad y distinguir entre quien usa la solución y quien la compra.[^6]

Un prototipo es mejor cuando la duda está en la comprensión o el recorrido. Un servicio manual puede comprobar si el resultado merece la pena antes de automatizarlo. Solo necesitamos un producto en uso cuando la pregunta depende de la repetición, la autonomía, la convivencia con otros sistemas o las consecuencias reales.

La mejor prueba no es la más barata en términos absolutos. Es la forma menos costosa de obtener evidencia suficiente para la siguiente decisión.

![Una sección de ala se prueba dentro de un túnel de viento sin necesidad de construir el avión completo.](/articles/construir-ya-no-es-el-cuello-de-botella/prueba-tunel-de-viento.png "Cuando la duda es concreta, una prueba enfocada puede resolverla antes de construir el producto entero.")

## De una demostración atractiva a un sistema de aprendizaje

Volvamos a la herramienta de reuniones. Podríamos construir desde el principio la grabación, la identificación de voces, el resumen, las tareas, las integraciones y un panel de actividad. También podríamos avanzar en cuatro pasos más informativos.

### 1. Comprobar el problema en el trabajo que ya existe

En lugar de presentar la solución, pedimos a varios equipos que reconstruyan reuniones recientes: dónde quedaron los acuerdos, qué se perdió, quién tuvo que perseguir una respuesta y qué consecuencias produjo. Revisamos documentos, mensajes o tareas cuando sea posible.

Si no aparecen pérdidas frecuentes ni un coste visible, la transcripción deja de ser relevante. Quizá el problema real esté en decidir durante la reunión, no en recordar después.

### 2. Entregar el resultado a mano

Preparamos un resumen con acuerdos, responsables y dudas utilizando las herramientas disponibles. La persona recibe el resultado como lo recibiría más adelante, pero todavía no construimos la automatización completa.

Observamos qué corrige, qué comparte y qué parte ignora. Si solo valora el texto libre y nunca crea las tareas, ya hemos evitado construir una integración que no cambia el resultado.

### 3. Probar la repetición dentro de una rutina

Durante un periodo acordado, el equipo utiliza una versión pequeña en reuniones reales. Medimos si abre el resumen, resuelve las dudas, comparte los acuerdos y vuelve a hacerlo sin que tengamos que recordárselo.

Aquí aparece información que una demo no puede ofrecer: permisos, confianza, retrasos aceptables, momentos en los que una reunión no debe grabarse y trabajo adicional que la solución puede estar creando.

### 4. Presentar una decisión comercial real

La prueba termina con una oferta concreta: qué incluye, qué responsabilidad asumimos, cuánto cuesta y qué necesita el equipo para continuar. Un “me interesa” y una compra no son la misma señal.

No hace falta que cada paso confirme la idea original. Si el resumen se comparte pero nadie quiere grabar, podemos cambiar la forma de entrada. Si el uso se repite pero no existe presupuesto independiente, quizá sea una función de otra herramienta y no un producto. Si la corrección lleva tanto tiempo como el trabajo manual, tenemos que mejorar la calidad o limitar la promesa.

El objetivo no es aprobar cuatro exámenes. Es descubrir qué decisión permite la evidencia disponible.

## Medir menos y decidir mejor

Una primera versión puede registrar páginas vistas, clics, sesiones, errores y decenas de eventos. Que podamos recogerlos no significa que todos ayuden.

Para cada medida deberíamos poder completar esta frase:

> Miraremos **[una señal]** porque nos ayudará a decidir **[una acción]**.

Si queremos saber si el resumen entra en el trabajo del equipo, medir cuántas veces se comparte o se convierte en tareas está más cerca de la pregunta que medir cuánto tiempo permanece abierta la página. Si queremos saber si existe un hábito, una segunda semana de uso importa más que un pico de registros el día del lanzamiento.

También necesitamos contexto. Una persona puede abandonar porque la propuesta no le sirve, porque invitamos al perfil equivocado o porque la primera versión falló justo cuando intentó utilizarla. Los datos muestran qué ocurrió; hablar con la persona y revisar el recorrido ayuda a entender por qué.

Medir con propósito reduce además la información que recogemos y debemos proteger. La analítica de un MVP no debería ser una red lanzada por si algún dato resulta útil más adelante. Debería ser una parte pequeña y deliberada de su diseño.

## Aprender rápido no significa entregar algo descuidado

El artículo anterior defendía que [mínimo no significa incompleto](/es/articulos/minimo-no-significa-incompleto): si pedimos a alguien que utilice una primera versión de verdad, tiene que poder completar un recorrido valioso con la claridad y la confianza necesarias.

Aquí hay una distinción importante. Una entrevista no necesita comportarse como un producto. Un prototipo puede simular partes del recorrido. Un servicio manual puede apoyarse en el equipo mientras lo declaremos y cuidemos. Pero cuando la prueba depende del uso real, los fallos básicos contaminan la evidencia.

Si nadie vuelve porque perdió su trabajo, no hemos aprendido que la propuesta carece de valor. Si una persona no puede entrar por un problema de accesibilidad, no hemos puesto a prueba su necesidad. Si el resumen revela información a quien no corresponde, el daño no se justifica por estar “validando”.

Cada experimento necesita la calidad suficiente para que su resultado sea interpretable y su riesgo sea responsable. No más. Tampoco menos.

## Un mapa de hipótesis para la siguiente versión

Antes de construir, utilizo un mapa breve que cabe en una página. Obliga a relacionar la versión con una decisión en lugar de empezar por una lista de funciones.

### 1. Escribir la decisión

¿Qué tendremos que decidir después: continuar, cambiar de persona, reducir la promesa, invertir en una integración o detener la idea?

### 2. Nombrar la hipótesis más arriesgada

No la más interesante ni la más fácil de probar. La que, si fuera falsa, haría menos sensato seguir por el mismo camino.

### 3. Anotar la evidencia que ya existe

Separar hechos, observaciones y compromisos de opiniones o intuiciones. Esto evita repetir una conversación que ya tuvimos y también dar por probado algo que solo escuchamos una vez.

### 4. Elegir la prueba más pequeña que conserve el contexto

Entrevista, observación, prototipo, trabajo manual, prueba técnica, piloto o producto. La prueba debe acercarse a la situación real tanto como exija la decisión que viene después.

### 5. Fijar una señal y un umbral antes de empezar

Qué observaremos, durante cuánto tiempo y qué resultado nos dará confianza suficiente. El umbral no convierte la incertidumbre en una certeza científica, pero hace visible nuestro criterio.

### 6. Acordar qué haremos con cada resultado

Continuar, repetir con una prueba más fuerte, cambiar la propuesta o parar. También conviene decidir qué evidencia nos obligaría a revisar el propio experimento.

Podemos resumirlo así:

> Creemos que **[una persona]**, cuando **[vive una situación]**, cambiará **[un comportamiento]** porque **[obtiene un resultado]**. Lo pondremos a prueba mediante **[un experimento]**. Observaremos **[una señal]** y, si ocurre **[un umbral]**, decidiremos **[el siguiente paso]**.

El Test Card de Strategyzer sigue una lógica parecida: obliga a definir qué tendría que ser cierto y qué aspecto tendría el éxito antes de interpretar los resultados.[^3] No elimina el juicio, pero hace que el equipo pueda discutirlo.

## Construir sigue siendo una ventaja cuando compra aprendizaje

La IA nos permite explorar direcciones, probar alternativas y convertir una decisión en software con una velocidad que hace poco no teníamos. Sería absurdo renunciar a esa capacidad. También sería un desperdicio utilizarla para producir respuestas a preguntas que nadie ha formulado.

Y Combinator recomienda elegir un problema significativo, lanzar pronto y aprender de quienes usan el producto.[^7] La parte fácil de repetir es “lanzar pronto”. La parte importante es que el lanzamiento nos acerque al problema y cambie lo que hacemos después.

Una primera versión no valida una empresa entera. Reduce una incertidumbre lo suficiente para asumir la siguiente. Habrá dudas que solo se resuelvan con meses de uso, ventas repetidas o una operación a mayor escala. Lo honesto es saber qué hemos aprendido y qué sigue siendo una apuesta.

Por eso, antes de añadir la próxima función, prefiero hacer una pregunta distinta:

> ¿Qué incertidumbre estamos pagando por reducir con esta versión?

Si no podemos responder, construir más rápido solo nos llevará antes al mismo lugar. Si podemos hacerlo, la velocidad deja de ser una promesa y se convierte en una ventaja.

[^1]: [Google Research, *DORA 2025 State of AI-assisted Software Development*](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/), investigación basada en más de cien horas de datos cualitativos y respuestas de casi cinco mil profesionales.
[^2]: [Stack Overflow, *Developer Survey 2025: AI*](https://survey.stackoverflow.co/2025/ai), resultados sobre confianza, frustraciones y uso de herramientas de IA en el desarrollo.
[^3]: [Alex Osterwalder, *Validate Your Ideas with the Test Card*](https://www.strategyzer.com/library/validate-your-ideas-with-the-test-card), Strategyzer.
[^4]: [Strategyzer, *Business Testing: Is Your Hypothesis Really Validated?*](https://www.strategyzer.com/library/business-testing-is-your-hypothesis-really-validated), sobre fuerza y límites de distintas evidencias.
[^5]: [GOV.UK Service Manual, *How the discovery phase works*](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works).
[^6]: [Y Combinator, *Practical Design: User Observation*](https://www.ycombinator.com/blog/practical-design-user-observation/).
[^7]: [Michael Seibel, *The Real Product Market Fit*](https://www.ycombinator.com/blog/the-real-product-market-fit/), Y Combinator.
