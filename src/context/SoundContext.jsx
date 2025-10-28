import { createContext, useState, useEffect } from "react";
import { SESSION } from "@utils/constants";
import { soundManager } from "@utils/soundManager";

// Crear contexto
export const SoundContext = createContext(null);

// Provider del contexto
export const SoundProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.5);

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

    const playSound = (soundFile, customVolume = null) => {
        if (isMuted) return;
        soundManager.play(soundFile, customVolume);
    };
    const playSuccess = () => !isMuted && soundManager.playSuccess();
    const playError = () => !isMuted && soundManager.playError();
    const playNotification = () => !isMuted && soundManager.playNotification();
    const playCritical = () => !isMuted && soundManager.playCritical();

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        newMutedState ? soundManager.disable() : soundManager.enable();
        localStorage.setItem(SESSION.SOUND_KEY, newMutedState.toString());
    };
    const mute = () => {
        setIsMuted(true);
        soundManager.disable();
        localStorage.setItem(SESSION.SOUND_KEY, "true");
    };
    const unmute = () => {
        setIsMuted(false);
        soundManager.enable();
        localStorage.setItem(SESSION.SOUND_KEY, "false");
    };

    const setVolume = (newVolume) => {
        const clamped = Math.max(0, Math.min(1, newVolume));
        setVolumeState(clamped);
        soundManager.setVolume(clamped);
    };

    const stopAll = () => soundManager.stopAll();

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

    return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
};
