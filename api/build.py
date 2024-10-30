import sys
import PyInstaller.__main__

# Path to the installer script
import os

installer_script = os.path.join(os.path.dirname(__file__), "main.py")
print(installer_script)

def build_executable():
    try:
        # Run PyInstaller with the onefile option
        PyInstaller.__main__.run([
            '--onefile',
            '--hidden-import=main',  # Add this line to fix the import issue
            installer_script
        ])
        print("Build completed successfully.")
    except Exception as e:
        print(f"Error occurred during the build: {e}")
        sys.exit(1)

if __name__ == "__main__":
    build_executable()

