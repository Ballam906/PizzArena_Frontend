from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 10)

try:
    driver.get("http://localhost:5173")
    driver.maximize_window()

    rendel_button = wait.until(
        EC.element_to_be_clickable((By.LINK_TEXT, "Rendelés"))
    )
    rendel_button.click()

    wait.until(EC.presence_of_element_located((By.XPATH, "//h2[text()='Bejelentkezés']")))

    username_input = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='pl. Pizzafan123']"))
    )
    password_input = driver.find_element(By.XPATH, "//input[@placeholder='••••••••']")
    login_button = driver.find_element(By.XPATH, "//button[text()='Belépés']")

    username_input.send_keys("tesztuser")
    password_input.send_keys("teszt123")
    login_button.click()

    time.sleep(2)

    current_url = driver.current_url
    print("Aktuális URL a bejelentkezés után:", current_url)

    driver.get("http://localhost:5173/rendeles")
    time.sleep(1)

    guest_button = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Vendégként rendelek']"))
    )
    guest_button.click()

    time.sleep(2)
    print("Vendégként rendelek gomb működik.")

    driver.get("http://localhost:5173/rendeles")
    reg_tab = wait.until(
        EC.element_to_be_clickable((By.XPATH, "//button[text()='Regisztráció']"))
    )
    reg_tab.click()

    wait.until(EC.presence_of_element_located((By.XPATH, "//h2[text()='Regisztráció']")))

    reg_username = wait.until(
        EC.presence_of_element_located((By.XPATH, "//input[@placeholder='pl. Pizzafan123']"))
    )
    reg_email = driver.find_element(By.XPATH, "//input[@placeholder='valami@gmail.com']")
    reg_password = driver.find_element(By.XPATH, "//input[@placeholder='••••••••']")

    reg_username.send_keys("ujtesztuser")
    reg_email.send_keys("ujteszt@email.com")
    reg_password.send_keys("Teszt123!")

    reg_submit = driver.find_element(By.XPATH, "//button[@type='submit' and text()='Regisztráció']")
    reg_submit.click()

    time.sleep(2)
    print("Regisztrációs folyamat lefutott.")

    print("A Selenium E2E teszt sikeresen lefutott.")

except Exception as e:
    print(f"Hiba történt: {e}")
    driver.save_screenshot("error.png")

finally:
    time.sleep(2)
    driver.quit()