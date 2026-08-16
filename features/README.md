# Features

Cada dominio funcional vive en su propia carpeta:

```text
features/[domain]/
  components/   UI de producto
  hooks/        Orquestación y estado de interfaz
  services/     Firebase, HTTP u otras integraciones
  stores/       Estado compartido con Zustand, solo cuando sea necesario
```

Los componentes consumen hooks; los hooks orquestan stores y services; los services no dependen de React.
