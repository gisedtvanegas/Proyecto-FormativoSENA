from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

URL = "https://proyecto-formativo-sena.vercel.app/login"

usuario = os.environ.get("SELENIUM_USUARIO")
password = os.environ.get("SELENIUM_PASSWORD")

if not usuario or not password:
    raise Exception(
        "Faltan las variables SELENIUM_USUARIO y SELENIUM_PASSWORD"
    )

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 15)

try:
    driver.get(URL)

    # Campo usuario
    campo_usuario = wait.until(
        EC.visibility_of_element_located((By.ID, "usuario"))
    )

    # Campo contraseña
    campo_password = wait.until(
        EC.visibility_of_element_located((By.ID, "pass"))
    )

    campo_usuario.send_keys(usuario)
    campo_password.send_keys(password)

    # Botón Iniciar Sesión
    boton_login = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(., 'Iniciar Sesión')]")
        )
    )

    boton_login.click()

    # Esperar a que termine el proceso de login
    wait.until(
        lambda d: "/panel-usuario" in d.current_url
        or "/admin" in d.current_url
    )

    print("URL después del login:", driver.current_url)

    print("✅ SEL-002: LOGIN EXITOSO")

except Exception as e:
    print("❌ SEL-002: LOGIN FALLIDO")
    print("Error:", e)
    raise

finally:
    driver.quit()