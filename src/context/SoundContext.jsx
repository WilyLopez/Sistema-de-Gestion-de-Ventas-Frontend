import { createContext, useState, useEffect } from "react";
import { SESSION } from "@utils/constants";
import { soundManager } from "@utils/soundManager";

// Crear contexto
const SoundContext = createContext(null);

// Provider del contexto
export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.5);

    // Cargar configuración de sonido del localStorage al iniciar
    useEffect(() => {
        const storedMuted = localStorage.getItem(SESSION.SOUND_KEY);

        if (storedMuted === "false") {
            setIsMuted(false);
            soundManager.enable();
        } else if (storedMuted === "true") {
            setIsMuted(true);
            soundManager.disable();
        }
    }, []);

    // Reproducir sonido
    const playSound = (soundFile, customVolume = null) => {
        if (isMuted) return;
        soundManager.play(soundFile, customVolume);
    };

    // Reproducir sonido de éxito
    const playSuccess = () => {
        if (isMuted) return;
        soundManager.playSuccess();
    };

    // Reproducir sonido de error
    const playError = () => {
        if (isMuted) return;
        soundManager.playError();
    };

    // Reproducir sonido de notificación
    const playNotification = () => {
        if (isMuted) return;
        soundManager.playNotification();
    };

    // Reproducir sonido de alerta crítica
    const playCritical = () => {
        if (isMuted) return;
        soundManager.playCritical();
    };

    // Toggle mute
    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        if (newMutedState) {
            soundManager.disable();
        } else {
            soundManager.enable();
        }

        localStorage.setItem(SESSION.SOUND_KEY, newMutedState.toString());
    };

    // Mutear sonidos
    const mute = () => {
        setIsMuted(true);
        soundManager.disable();
        localStorage.setItem(SESSION.SOUND_KEY, "true");
    };

    // Desmutear sonidos
    const unmute = () => {
        setIsMuted(false);
        soundManager.enable();
        localStorage.setItem(SESSION.SOUND_KEY, "false");
    };

    // Cambiar volumen
    const setVolume = (newVolume) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume));
        setVolumeState(clampedVolume);
        soundManager.setVolume(clampedVolume);
    };

    // Detener todos los sonidos
    const stopAll = () => {
        soundManager.stopAll();
    };

    // Valor del contexto
    const value = {
        isMuted,
        volume,
        playSound,
        playSuccess,
        playError,
        playNotification,
        playCritical,
        toggleMute,
        mute,
        unmute,
        setVolume,
        stopAll,
    };

    return (
        <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
    );
};

export { SoundContext };