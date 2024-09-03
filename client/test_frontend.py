from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

class SimpleWebAppTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(10)  

    def test_landing_page_title(self):
        self.driver.get("http://localhost:3000")
        self.assertIn("InVITe", self.driver.title)

    def test_landing_page_header(self):
        self.driver.get("http://localhost:3000")
        header = self.driver.find_element(By.TAG_NAME, "header")
        self.assertTrue(header.is_displayed())

    def test_signin_page_elements(self):
        self.driver.get("http://localhost:3000/users/signin")
        email_input = self.driver.find_element(By.ID, "email")
        submit_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        self.assertTrue(email_input.is_displayed())
        self.assertTrue(submit_button.is_displayed())

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
