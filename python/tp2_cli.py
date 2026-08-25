#!/usr/bin/env python3
"""
Visualizador de Funciones Continuas Digitalizadas
Script de demostración en Python (NumPy + Matplotlib)
"""

import numpy as np
import matplotlib.pyplot as plt

# --- 1. Definición de Funciones Matemáticas Continuas Digitalizadas ---

# Escalón unitario: da 0 para tiempos anteriores a t0, y A a partir de t0
def escalon(t, A=2.0, t0=1.0):
    """x(t) = A * mu(t - t0)"""
    return np.where(t >= t0, A, 0.0)

# Senoidal: A * sen(2*pi*f0*t + fase)
def seno(t, A=2.0, f0=1.0, theta_deg=0.0):
    """x(t) = A * sin(2*pi*f0*t + theta)"""
    theta_rad = np.radians(theta_deg)
    return A * np.sin(2 * np.pi * f0 * t + theta_rad)

# Exponencial: A * e^(alpha * (t - t0))
def exponencial(t, A=2.0, alpha=-0.5, t0=1.0):
    """x(t) = A * exp(alpha * (t - t0))"""
    return A * np.exp(alpha * (t - t0))

# Señal amortiguada: producto del seno por la caída/crecimiento exponencial
def senal_amortiguada(t, A=2.0, f0=1.0, theta_deg=0.0, alpha=-0.5):
    """x(t) = A * sin(2*pi*f0*t + theta) * exp(alpha * t)"""
    theta_rad = np.radians(theta_deg)
    return A * np.sin(2 * np.pi * f0 * t + theta_rad) * np.exp(alpha * t)

# Pulso recortado: vale A en el intervalo entre t0 y t0 + D
def pulso(t, A=2.0, t0=1.0, D=3.0):
    """p(t) = A * [mu(t - t0) - mu(t - t0 - D)]"""
    return np.where((t >= t0) & (t <= t0 + D), A, 0.0)


# --- 2. Generación del Dominio (Vector de Tiempo t) ---
t_min, t_max = -2.0, 8.0
num_puntos = 300
# Armo el vector de tiempo t con 300 muestras parejas entre t_min y t_max
t = np.linspace(t_min, t_max, num_puntos)

# Calculo los vectores de salida (imágenes) pasando el vector t a cada función
x_escalon = escalon(t)
x_seno = seno(t)
x_exp = exponencial(t)
x_amortiguada = senal_amortiguada(t)
x_pulso = pulso(t)

print("=" * 60)
print("  VISUALIZADOR DE FUNCIONES CONTINUAS DIGITALIZADAS  ")
print("=" * 60)
print(f"Dominio t: Arreglo de {num_puntos} puntos desde {t_min}s hasta {t_max}s")
print(f"Paso de muestreo Δt = {(t[1]-t[0]):.4f}s\n")

print(f"Muestra Dominio T[:5] : {np.round(t[:5], 3)}")
print(f"Muestra Escalón X[:5] : {x_escalon[:5]}")
print(f"Muestra Seno X[:5]    : {np.round(x_seno[:5], 3)}")
print(f"Muestra Pulso X[:5]   : {x_pulso[:5]}")
print("=" * 60)

# --- 3. Graficación con Estilos Visuales Diferenciados por Función ---
fig = plt.figure(figsize=(14, 10))
fig.suptitle('Visualización Diferenciada de Funciones Continuas Digitalizadas', fontsize=15, fontweight='bold')

# Subplot 1: Escalón
ax1 = plt.subplot(3, 2, 1)
ax1.step(t, x_escalon, where='post', color='#06b6d4', linewidth=2.5, label='Escalón A=2, t0=1')
ax1.axvline(1.0, color='#06b6d4', linestyle='--', alpha=0.7, label='Umbral t0=1s')
ax1.fill_between(t, x_escalon, step='post', alpha=0.2, color='#06b6d4')
ax1.set_title('1. Escalón Unitario', fontweight='bold', color='#06b6d4')
ax1.set_xlabel('Tiempo t (s)')
ax1.set_ylabel('x(t)')
ax1.grid(True, linestyle=':', alpha=0.6)
ax1.legend()

# Subplot 2: Senoidal
ax2 = plt.subplot(3, 2, 2)
ax2.plot(t, x_seno, color='#ec4899', linewidth=2, label='Seno (f0=1Hz)')
ax2.axhline(2.0, color='#ec4899', linestyle='--', alpha=0.5, label='+A')
ax2.axhline(-2.0, color='#ec4899', linestyle='--', alpha=0.5, label='-A')
ax2.axhline(0, color='gray', linestyle='-', alpha=0.3)
ax2.set_title('2. Senoidal', fontweight='bold', color='#ec4899')
ax2.set_xlabel('Tiempo t (s)')
ax2.set_ylabel('x(t)')
ax2.grid(True, linestyle=':', alpha=0.6)
ax2.legend()

# Subplot 3: Exponencial
ax3 = plt.subplot(3, 2, 3)
ax3.plot(t, x_exp, color='#10b981', linewidth=2.5, label='Exponencial (α=-0.5)')
ax3.set_title('3. Exponencial', fontweight='bold', color='#10b981')
ax3.set_xlabel('Tiempo t (s)')
ax3.set_ylabel('x(t)')
ax3.grid(True, linestyle=':', alpha=0.6)
ax3.legend()

# Subplot 4: Señal Amortiguada (agrego las envolventes superior e inferior)
ax4 = plt.subplot(3, 2, 4)
envolvente_sup = 2.0 * np.exp(-0.5 * t)
envolvente_inf = -envolvente_sup
ax4.plot(t, x_amortiguada, color='#6366f1', linewidth=2, label='Señal Amortiguada')
ax4.plot(t, envolvente_sup, color='#f59e0b', linestyle='--', alpha=0.8, label='Envolvente +A·e^(αt)')
ax4.plot(t, envolvente_inf, color='#f59e0b', linestyle='--', alpha=0.8, label='Envolvente -A·e^(αt)')
ax4.set_title('4. Señal Amortiguada', fontweight='bold', color='#6366f1')
ax4.set_xlabel('Tiempo t (s)')
ax4.set_ylabel('x(t)')
ax4.grid(True, linestyle=':', alpha=0.6)
ax4.legend()

# Subplot 5: Pulso Recortado
ax5 = plt.subplot(3, 2, (5, 6))
ax5.step(t, x_pulso, where='post', color='#a855f7', linewidth=3, label='Pulso (t0=1s, D=3s)')
ax5.fill_between(t, x_pulso, step='post', alpha=0.25, color='#a855f7')
ax5.axvline(1.0, color='#a855f7', linestyle='--', alpha=0.7, label='Inicio t0')
ax5.axvline(4.0, color='#a855f7', linestyle='--', alpha=0.7, label='Fin t0+D')
ax5.set_title('5. Pulso Recortado', fontweight='bold', color='#a855f7')
ax5.set_xlabel('Tiempo t (s)')
ax5.set_ylabel('p(t)')
ax5.grid(True, linestyle=':', alpha=0.6)
ax5.legend()

plt.tight_layout()
print("\nMostrando gráfico de Matplotlib con las 5 funciones diferenciadas...")
plt.savefig('python/graficos_funciones.png', dpi=150)
print("Gráfico guardado exitosamente en 'python/graficos_funciones.png'")
plt.show()
