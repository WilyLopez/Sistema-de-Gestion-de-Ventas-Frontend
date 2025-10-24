import { useContext } from "react";
import { SoundContext } from "@context/SoundContext";

// Hook para usar el contexto de sonidos
export const useSound = () => {
    const context = useContext(SoundContext);

    if (!context) {
        throw new Error("useSound debe ser usado dentro de SoundProvider");
    }

    return context;
};
