/**
 * Componente Skeleton reutilizable
 * Placeholders animados durante la carga
 */
const Skeleton = ({
    variant = "text",
    width,
    height,
    circle = false,
    count = 1,
    className = "",
}) => {
    const baseStyles = "animate-pulse bg-gray-200 dark:bg-dark-hover";

    const variants = {
        text: "h-4 rounded",
        title: "h-8 rounded",
        button: "h-10 rounded-lg",
        avatar: "h-12 w-12 rounded-full",
        card: "h-48 rounded-lg",
        image: "h-64 rounded-lg",
    };

    const variantClass = variants[variant] || variants.text;
    const circleClass = circle ? "rounded-full" : "";

    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    const skeletonElement = (
        <div
            className={`${baseStyles} ${variantClass} ${circleClass} ${className}`}
            style={style}
        />
    );

    if (count > 1) {
        return (
            <div className="space-y-3">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index}>{skeletonElement}</div>
                ))}
            </div>
        );
    }

    return skeletonElement;
};

export default Skeleton;
