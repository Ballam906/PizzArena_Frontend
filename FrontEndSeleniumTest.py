from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import Select
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
wait = WebDriverWait(driver, 10)

def pause():
    time.sleep(1.5)
    
def scroll_smooth():
    height = driver.execute_script("return document.body.scrollHeight")

    current = 0
    while current < height:
        driver.execute_script(f"""
            window.scrollTo({{
                top: {current},
                behavior: 'smooth'
            }});
        """)
        current += 250
        time.sleep(1.2)

    time.sleep(1)

    # vissza tetejére
    driver.execute_script("""
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    """)
    time.sleep(1)

try:
    # 1. Kezdőlap
    driver.get("http://localhost:5173")
    driver.maximize_window()
    pause()

    # # 2. Görgetés a kezdőlapon
    scroll_smooth()
    pause()

    # # 3. Rólunk oldal
    rolunk_gomb = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Éttermeink")))
    rolunk_gomb.click()
    scroll_smooth()
    pause()

    # 4. Rendelés oldal
    rendeles_gomb = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Add le a rendelésed!")))
    rendeles_gomb.click()
    pause()
    
    reg_button = driver.find_element(By.XPATH, "//button[text()='Regisztráció']")
    reg_button.click()
    pause()

    # 6. Regisztrációs mezők
    username_input = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='pl. Pizzafan123']")))
    email_input = driver.find_element(By.XPATH, "//input[@placeholder='valami@gmail.com']")
    password_input = driver.find_element(By.XPATH, "//input[@placeholder='••••••••']")

    username_input.send_keys("tesztuser4")
    email_input.send_keys("teszt@email.com")
    password_input.send_keys("Teszt123!")
    pause()

    reg_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//form[@id='register-form']//button[@type='submit']")))
    reg_button.click()
    pause()

    # 7. Bejelentkezés
    login_tab = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Bejelentkezés']")))
    login_tab.click()
    pause()

    login_username = wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='pl. Pizzafan123']")))
    login_password = driver.find_element(By.XPATH, "//input[@placeholder='••••••••']")

    login_username.send_keys("tesztuser4")
    login_password.send_keys("Teszt123!")
    pause()

    login_button = driver.find_element(By.XPATH, "//button[text()='Belépés']")
    login_button.click()
    pause()

    # 8. Első étel kosárba
    rendel_gomb = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Kosárba')]")))
    rendel_gomb.click()
    pause()

    # 9. Kosár megnyitása
    kosar_gomb = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(),'🛒')]")))
    kosar_gomb.click()
    pause()



    # 10. Hibás kitöltés
    restaurant_select = wait.until(
        EC.presence_of_element_located((By.XPATH, "//select[contains(@class,'kosar-form-input')]"))
    )

    nev_input = driver.find_element(By.XPATH, "//input[@placeholder='Név']")
    telefon_input = driver.find_element(By.XPATH, "//input[@placeholder='Telefonszám']")
    email_input = driver.find_element(By.XPATH, "//input[@placeholder='Email']")
    varos_input = driver.find_element(By.XPATH, "//input[@placeholder='Város']")
    iranyitoszam_input = driver.find_element(By.XPATH, "//input[@placeholder='Irányítószám']")
    utca_input = driver.find_element(By.XPATH, "//input[@placeholder='Utca, házszám']")
    egyeb_input = driver.find_element(By.XPATH, "//textarea[@placeholder='Egyéb (emelet, ajtó, kapukód, stb.)']")

    # étterem kiválasztása (ne az első "Válassz éttermet" opció maradjon)
    Select(restaurant_select).select_by_index(1)
    pause()

    # szándékosan hibás adatok
    nev_input.send_keys("a")
    telefon_input.send_keys("123")
    email_input.send_keys("rosszemail")
    varos_input.send_keys("x")
    iranyitoszam_input.send_keys("11")
    utca_input.send_keys("y")
    egyeb_input.send_keys("teszt")
    pause()

    rendeles_gomb = driver.find_element(By.XPATH, "//button[contains(text(),'Rendelés leadása')]")
    rendeles_gomb.click()
    pause()

    # 11. Javított kitöltés
    nev_input.clear()
    telefon_input.clear()
    email_input.clear()
    varos_input.clear()
    iranyitoszam_input.clear()
    utca_input.clear()
    egyeb_input.clear()

    nev_input.send_keys("Teszt Elek")
    telefon_input.send_keys("06301234567")
    email_input.send_keys("tesztelek@email.com")
    varos_input.send_keys("Budapest")
    iranyitoszam_input.send_keys("1117")
    utca_input.send_keys("Teszt utca 12")
    egyeb_input.send_keys("2. emelet, 5-ös ajtó")
    pause()

    rendeles_gomb.click()
    pause()
    print("A teszt lefutott.")

except Exception as e:
    print("Hiba:", e)
    driver.save_screenshot("error.png")

finally:
    time.sleep(2)
    driver.quit()