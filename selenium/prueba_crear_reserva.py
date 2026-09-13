from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import os
import time

LOGIN_URL = "https://proyecto-formativo-sena.vercel.app/login"
RESERVAS_URL = "https://proyecto-formativo-sena.vercel.app/mis-reservas"

usuario = os.environ.get("SELENIUM_USUARIO")
password = os.environ.get("SELENIUM_PASSWORD")

if not usuario or not password:
    raise Exception(
        "Faltan SELENIUM_USUARIO y SELENIUM_PASSWORD"
    )

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 20)

try:

    # ==========================================
    # 1. INICIAR SESIÓN
    # ==========================================

    driver.get(LOGIN_URL)

    campo_usuario = wait.until(
        EC.visibility_of_element_located((By.ID, "usuario"))
    )

    campo_password = wait.until(
        EC.visibility_of_element_located((By.ID, "pass"))
    )

    campo_usuario.send_keys(usuario)
    campo_password.send_keys(password)

    boton_login = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Iniciar Sesión')]")
        )
    )

    boton_login.click()

    wait.until(
        lambda d: "/panel-usuario" in d.current_url
        or "/admin" in d.current_url
    )

    print("✅ Inicio de sesión exitoso")

    # ==========================================
    # 2. IR A MIS RESERVAS
    # ==========================================

    driver.get(RESERVAS_URL)

    wait.until(
        EC.visibility_of_element_located(
            (By.XPATH, "//h2[contains(., 'Mis reservas')]")
        )
    )

    print("✅ Módulo Mis Reservas cargado")

    # ==========================================
    # 3. ABRIR FORMULARIO DE RESERVA
    # ==========================================

    boton_abrir = wait.until(
        EC.element_to_be_clickable(
            (By.ID, "abrirReserva")
        )
    )

    boton_abrir.click()

    wait.until(
        EC.visibility_of_element_located(
            (By.ID, "reservaForm")
        )
    )

    print("✅ Formulario de reserva abierto")

    # ==========================================
    # 4. NÚMERO DE PERSONAS
    # ==========================================

    campo_personas = wait.until(
        EC.visibility_of_element_located(
            (By.NAME, "num_personas")
        )
    )

    campo_personas.clear()
    campo_personas.send_keys("2")

    print("✅ Personas: 2")

    # ==========================================
    # 5. FECHA
    # ==========================================

    # 7 días después de hoy
    fecha_reserva = datetime.now() + timedelta(days=7)
    fecha_formato = fecha_reserva.strftime("%Y-%m-%d")

    campo_fecha = wait.until(
        EC.visibility_of_element_located(
            (By.NAME, "fecha")
        )
    )

    campo_fecha.send_keys(fecha_formato)

    print("✅ Fecha:", fecha_formato)

    # ==========================================
    # 6. HORA
    # ==========================================

    campo_hora = wait.until(
        EC.visibility_of_element_located(
            (By.NAME, "hora")
        )
    )

    campo_hora.send_keys("08:00")

    print("✅ Hora: 08:00")

    # ==========================================
    # 7. SELECCIONAR ACTIVIDAD
    # ==========================================

    select_actividad = wait.until(
        EC.visibility_of_element_located(
            (By.NAME, "Actividad_idActividad")
        )
    )

    selector = Select(select_actividad)

    opciones = selector.options

    if len(opciones) < 2:
        raise Exception("No hay actividades disponibles para reservar")

    # Seleccionar la primera actividad real
    selector.select_by_index(1)

    actividad_seleccionada = selector.first_selected_option.text

    print("✅ Actividad:", actividad_seleccionada)

    # ==========================================
    # 8. CONFIRMAR RESERVA
    # ==========================================

    boton_confirmar = wait.until(
        EC.element_to_be_clickable(
            (By.ID, "abrirPago")
        )
    )

    boton_confirmar.click()

    print("✅ Ventana de confirmación abierta")

    # ==========================================
    # 9. REGISTRAR RESERVA
    # ==========================================

    boton_registrar = wait.until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//div[@id='pagoModal']//button[contains(., 'Registrar reserva')]"
            )
        )
    )

    boton_registrar.click()

    print("⏳ Registrando reserva...")

    # ==========================================
    # 10. COMPROBAR ÉXITO
    # ==========================================

    modal_exito = wait.until(
        EC.visibility_of_element_located(
            (By.ID, "exito")
        )
    )

    titulo_exito = wait.until(
        EC.visibility_of_element_located(
            (By.XPATH, "//div[@id='exito']//h2[contains(., 'Reserva realizada')]")
        )
    )

    print("Título:", titulo_exito.text)

    if modal_exito.is_displayed():
        print("SEL-004: RESERVA CREADA EXITOSAMENTE")
    else:
        print("SEL-004: NO SE PUDO CONFIRMAR LA RESERVA")

    time.sleep(3)

except Exception as e:

    print("❌ SEL-004: PRUEBA FALLIDA")
    print("Error:", e)
    raise

finally:
    driver.quit()