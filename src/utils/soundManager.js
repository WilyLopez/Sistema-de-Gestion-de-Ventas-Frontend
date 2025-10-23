import { SOUNDS } from "./constants";

class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = SOUNDS.ENABLED;
        this.volume = SOUNDS.VOLUME;
        this.preloadSounds();
    }

    // Precargar todos los sonidos al iniciar
    preloadSounds() {
        Object.entries(SOUNDS.FILES).forEach(([key, filename]) => {
            const audio = new Audio(`/sounds/${filename}`);
            audio.preload = "auto";
            audio.volume = this.volume;
            this.sounds[key] = audio;
        });
    }

    // Reproducir sonido
    play(soundKey, customVolume = null) {
        if (!this.enabled) return;

        const audio = this.sounds[soundKey];

        if (!audio) {
            console.warn(`Sonido "${soundKey}" no encontrado`);
            return;
        }

        try {
            // Reiniciar el audio si ya está reproduciéndose
            audio.currentTime = 0;

            // Aplicar volumen personalizado si se proporciona
            if (customVolume !== null) {
                audio.volume = Math.max(0, Math.min(1, customVolume));
            } else {
                audio.volume = this.volume;
            }

            // Reproducir
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.warn("Error al reproducir sonido:", error);
                });
            }
        } catch (error) {
            console.warn("Error al reproducir sonido:", error);
        }
    }

    // Reproducir sonido de éxito
    playSuccess() {
        this.play("SUCCESS");
    }

    // Reproducir sonido de error
    playError() {
        this.play("ERROR");
    }

    // Reproducir sonido de notificación
    playNotification() {
        this.play("NOTIFICATION");
    }

    // Reproducir sonido de alerta crítica
    playCritical() {
        this.play("CRITICAL", 0.8); // Volumen más alto para alertas críticas
    }

    // Habilitar sonidos
    enable() {
        this.enabled = true;
        localStorage.setItem("sgvia_sound_enabled", "true");
    }

    // Deshabilitar sonidos
    disable() {
        this.enabled = false;
        localStorage.setItem("sgvia_sound_enabled", "false");
    }

    // Toggle sonidos
    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }

    // Verificar si los sonidos están habilitados
    isEnabled() {
        return this.enabled;
    }

    // Cambiar volumen global
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));

        Object.values(this.sounds).forEach((audio) => {
            audio.volume = this.volume;
        });
    }

    // Obtener volumen actual
    getVolume() {
        return this.volume;
    }

    // Detener todos los sonidos
    stopAll() {
        Object.values(this.sounds).forEach((audio) => {
            audio.pause();
            audio.currentTime = 0;
        });
    }
}

// Exportar instancia única
export const soundManager = new SoundManager();

// Exportar funciones de acceso rápido
export const playSuccess = () => soundManager.playSuccess();
export const playError = () => soundManager.playError();
export const playNotification = () => soundManager.playNotification();
export const playCritical = () => soundManager.playCritical();
export const toggleSound = () => soundManager.toggle();
export const isSoundEnabled = () => soundManager.isEnabled();
