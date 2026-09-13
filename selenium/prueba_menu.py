from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

URL = "https://proyecto-formativo-sena.vercel.app/menu"

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 20)

try:
    driver.get(URL)

    # Esperar a que cargue el título principal
    titulo = wait.until(
        EC.visibility_of_element_located(
            (By.XPATH, "//h2[contains(text(), 'Conoce nuestro delicioso menú')]")
        )
    )

    print("✅ Módulo de menú cargado")
    print("Título encontrado:", titulo.text)

    # Verificar que existan las tarjetas del menú
    tarjetas = wait.until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, ".tarjeta-menu")
        )
    )

    if len(tarjetas) > 0:
        print(f"✅ Se encontraron {len(tarjetas)} productos")
        print("🎉 SEL-007: INGRESO A MENÚ EXITOSO")
    else:
        raise Exception("No se encontraron productos del menú")

    time.sleep(3)

finally:
    driver.quit()