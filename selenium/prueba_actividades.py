from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

URL = "https://proyecto-formativo-sena.vercel.app/actividades"

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 20)

try:
    driver.get(URL)

    # Esperar a que cargue el título principal
    titulo = wait.until(
        EC.visibility_of_element_located(
            (By.XPATH, "//h2[contains(text(), 'Explora nuestras actividades')]")
        )
    )

    print("✅ Módulo de actividades cargado")
    print("Título encontrado:", titulo.text)

    # Verificar que existan las tarjetas de actividades
    tarjetas = wait.until(
        EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, ".tarjeta-actividad")
        )
    )

    if len(tarjetas) > 0:
        print(f"✅ Se encontraron {len(tarjetas)} actividades")
        print("🎉 SEL-006: INGRESO A ACTIVIDADES EXITOSO")
    else:
        raise Exception("No se encontraron tarjetas de actividades")

    time.sleep(3)

finally:
    driver.quit()