from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import random
import time

URL = "https://proyecto-formativo-sena.vercel.app/registro"

driver = webdriver.Chrome()
wait = WebDriverWait(driver, 20)

try:

    # ==========================================
    # 1. ABRIR REGISTRO
    # ==========================================

    driver.get(URL)

    wait.until(
        EC.visibility_of_element_located((By.ID, "nombre"))
    )

    print("✅ Página de registro cargada")

    # ==========================================
    # 2. GENERAR DATOS DE PRUEBA
    # ==========================================

    numero = random.randint(100000, 999999)

    nombre = "Usuario"
    apellido = "Selenium"
    documento = "10" + str(numero)
    telefono = "300" + str(numero)
    correo = f"selenium{numero}@ejemplo.com"
    clave = "Selenium123!"

    # ==========================================
    # 3. NOMBRE
    # ==========================================

    driver.find_element(By.ID, "nombre").send_keys(nombre)

    # ==========================================
    # 4. APELLIDO
    # ==========================================

    driver.find_element(By.ID, "apellido").send_keys(apellido)

    # ==========================================
    # 5. TIPO DE DOCUMENTO
    # ==========================================

    select_documento = wait.until(
        EC.visibility_of_element_located((By.ID, "tipodoc"))
    )

    selector = Select(select_documento)

    # Seleccionar la primera opción real
    if len(selector.options) < 2:
        raise Exception("No hay tipos de documento disponibles")

    selector.select_by_index(1)

    print("✅ Tipo de documento seleccionado")

    # ==========================================
    # 6. DOCUMENTO
    # ==========================================

    driver.find_element(
        By.ID, "documento"
    ).send_keys(documento)

    # ==========================================
    # 7. TELÉFONO
    # ==========================================

    driver.find_element(
        By.ID, "telefono"
    ).send_keys(telefono)

    # ==========================================
    # 8. CORREO
    # ==========================================

    driver.find_element(
        By.ID, "correo"
    ).send_keys(correo)

    # ==========================================
    # 9. CONTRASEÑA
    # ==========================================

    driver.find_element(
        By.ID, "clave"
    ).send_keys(clave)

    # ==========================================
    # 10. FECHA DE NACIMIENTO
    # ==========================================

    fecha_nacimiento = (
        datetime.now() - timedelta(days=365 * 20)
    ).strftime("%Y-%m-%d")

    driver.find_element(
        By.ID, "fecha_nac"
    ).send_keys(fecha_nacimiento)

    # ==========================================
    # 11. TÉRMINOS Y CONDICIONES
    # ==========================================

    boton_terminos = wait.until(
        EC.element_to_be_clickable(
            (By.ID, "abrir-terminos")
        )
    )

    boton_terminos.click()

    wait.until(
        EC.visibility_of_element_located(
            (By.ID, "modal-terminos")
        )
    )

    print("✅ Términos y condiciones abiertos")

    # Cerrar/aceptar términos
    boton_aceptar = wait.until(
        EC.element_to_be_clickable(
            (By.ID, "aceptar-terminos")
        )
    )

    boton_aceptar.click()

    # ==========================================
    # 12. ACEPTAR CHECKBOX
    # ==========================================

    checkbox = wait.until(
        EC.element_to_be_clickable(
            (By.ID, "checkbox")
        )
    )

    if not checkbox.is_selected():
        checkbox.click()

    print("✅ Términos aceptados")

    # ==========================================
    # 13. REGISTRAR
    # ==========================================

    boton_registro = wait.until(
        EC.element_to_be_clickable(
            (
                By.XPATH,
                "//button[@type='submit' and contains(., 'Registrarse')]"
            )
        )
    )

    boton_registro.click()

    print("⏳ Registrando usuario...")

    # ==========================================
    # 14. COMPROBAR RESULTADO
    # ==========================================

    try:

        mensaje_exito = WebDriverWait(driver, 15).until(
            EC.visibility_of_element_located(
                (
                    By.XPATH,
                    "//*[contains(text(), 'Registro completado')]"
                )
            )
        )

        print("Mensaje:", mensaje_exito.text)
        print("Correo utilizado:", correo)
        print("Documento utilizado:", documento)

        print("SEL-005: REGISTRO EXITOSO")

    except:

        # Si no aparece éxito, comprobar si hay mensaje de error
        mensajes = driver.find_elements(
            By.CSS_SELECTOR,
            ".mensaje"
        )

        print("SEL-005: REGISTRO NO CONFIRMADO")

        for mensaje in mensajes:
            if mensaje.is_displayed():
                print("Mensaje del sistema:", mensaje.text)

        raise

    time.sleep(3)

finally:

    driver.quit()