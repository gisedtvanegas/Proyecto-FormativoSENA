from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

options = Options()

driver = webdriver.Chrome(options=options)

try:
    driver.get("https://proyecto-formativo-sena.vercel.app/")

    time.sleep(5)

    titulo = driver.title

    print("Título de la página:", titulo)

    if "Casa Jardín" in titulo:
        print("SEL-001: PRUEBA EXITOSA")
    else:
        print("SEL-001: PRUEBA FALLIDA")

finally:
    driver.quit()