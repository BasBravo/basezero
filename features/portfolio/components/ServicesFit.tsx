import styles from './portfolio.module.css';

type ServiceItem = {
    number: string;
    title: string;
    body: string;
};

type ServicesFitProps = {
    title: string;
    body: string;
    services: ServiceItem[];
};

export function ServicesFit({ title, body, services }: ServicesFitProps) {
    return (
        <section className={styles.servicesSection} aria-labelledby="services-title">
            <div className={styles.servicesIntro}>
                <h2 id="services-title" className={styles.servicesTitle}>{title}</h2>
                <p className={styles.servicesBody}>{body}</p>
            </div>
            <ol className={styles.servicesList}>
                {services.map((service) => (
                    <li className={styles.serviceItem} key={service.number}>
                        <span className={styles.serviceNumber} aria-hidden="true">{service.number}</span>
                        <h3>{service.title}</h3>
                        <p>{service.body}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}
