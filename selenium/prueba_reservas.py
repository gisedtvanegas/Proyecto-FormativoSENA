from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

LOGIN_URL = "https://proyecto-formativo-sena.vercel.app/login"
RESERVAS_URL = "https://proyecto-formativo-sena.vercel.app/mis-reservas"

usuario = os.environ.get("SELENIUM_USUARIO")
password = os.environ.get("SELENIUM_PASSWORD")

if not usuario or not password:
    raise Exception(
        "Faltan las variables SELENIUM_USUARIO y SELENIUM_PASSWORD"
    )

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 15)

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

    # Esperar autenticación
    wait.until(
        lambda d: "/panel-usuario" in d.current_url
        or "/admin" in d.current_url
    )

    print("✅ Inicio de sesión realizado")

    # ==========================================
    # 2. IR A MIS RESERVAS
    # ==========================================

    driver.get(RESERVAS_URL)

    # Esperar título de la página
    titulo = wait.until(
        EC.visibility_of_element_located(
            (By.XPATH, "//h2[contains(., 'Mis reservas')]")
        )
    )

    print("Título encontrado:", titulo.text)

    # ==========================================
    # 3. VERIFICAR BOTÓN CREAR RESERVA
    # ==========================================

    boton_reserva = wait.until(
        EC.presence_of_element_located(
            (By.ID, "abrirReserva")
        )
    )

    if boton_reserva.is_displayed():
        print("✅ Botón 'Crear reserva' encontrado")

    print("URL actual:", driver.current_url)

    if "/mis-reservas" in driver.current_url:
        print("✅ SEL-003: MÓDULO DE RESERVAS ACCESIBLE")
    else:
        print("❌ SEL-003: RUTA INCORRECTA")

except Exception as e:

    print("❌ SEL-003: PRUEBA FALLIDA")
    print("Error:", e)
    raise

finally:
    driver.quit()