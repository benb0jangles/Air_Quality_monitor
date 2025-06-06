![Environmental Monitor Banner](https://github.com/benb0jangles/Air_Quality_monitor/blob/main/PICS/banner1.jpg)

live data here>>>>>C02/VOC/N0x/Dust_Particulate
https://benb0jangles.github.io/Air_Quality_monitor/

![monitor_image1](https://github.com/benb0jangles/Air_Quality_monitor/blob/main/PICS/IMG_20250502_120009_Bokeh%20(Small).jpg)

#C02 stats

![monitor_gif1](https://github.com/benb0jangles/Air_Quality_monitor/blob/main/PICS/1_1.gif)

#PM Particulates view

![monitor_gif2](https://github.com/benb0jangles/Air_Quality_monitor/blob/main/PICS/3.gif)

#VOC + N0x screen


A comprehensive indoor air quality monitoring system built with ESP32-C3 Super Mini and multiple environmental sensors. This project helps you monitor CO2, temperature, humidity, volatile organic compounds (VOCs), nitrogen oxides (NOx), and particulate matter (PM1.0, PM2.5, PM10) to maintain healthy air quality in your home or office. You can buy a pcb sensor board in the below link.

## Features

- **Multi-sensor Integration**: Combines SCD41 (CO2/temp/humidity), SGP41 (VOC/NOx), and PMS5003 (particulate matter) for comprehensive environmental monitoring
- **Real-time Data Display**: Toggleable OLED screen interface with multiple views
- **Cloud Storage**: ThingSpeak integration for data logging and visualization
- **Web Dashboard**: GitHub Pages-based responsive dashboard for remote monitoring
- **Air Quality Assessment**: Shows air quality status based on established health standards
- **ESP32-C3 Based**: Low-power, compact, and WiFi-enabled design
- **Button Navigation**: Easy toggle between different sensor readings via a physical button

## Hardware Requirements

- PCB DIY Kit No Sensors No Esp32 Buy Here: [Buy Link Here](https://www.ebay.co.uk/itm/197329869838)
- PCB Pre-Soldered Board No Sensors or Esp32: (Link Coming Soon)
- 3d-Print your own mount (Look in the folder called STL)
- ESP32-C3 Super Mini development board (£1.64)
- SCD41 CO2, Temperature and Humidity sensor (£12.99)
- SGP41 VOC and NOx sensor (£8.72)
- PMS5003 Particulate Matter sensor (£10.60)
- 128×64 OLED display (I2C interface) (£1.64)
- 5V micro usb power supply (wall adapter or battery bank)


## Software Setup

## Installation (non-iot version- no wifi or thingspeak connectivity, just oled display)

### Direct Binary Upload:
If you just want to get the monitor running without wifi connectivity features:

1. Download `esp32c3supermini_scd41_sgp41_pms5003_oled_no_IOT.ino.bin` from this repository
2. Connect your ESP32-C3 Super Mini to your computer
3. Use one of these tools to flash the binary:
   - **ESP Flash Tool**: Upload to address 0x0
   - **esptool.py** (command line): 
     ```
     esptool.py --chip esp32c3 --port [YOUR_COM_PORT] --baud 460800 write_flash 0x0 esp32c3supermini_scd41_sgp41_pms5003_oled_no_IOT.ino.bin
     ```

## Installation (thingspeak iot version - oled + wifi connectivity + thingspeak)

### ThingSpeak Configuration

Before uploading the code, you need to:

1. Create a free ThingSpeak account
2. Create a new channel with 8 fields (CO2, temperature, humidity, VOC, NOx, PM2.5, PM10, PM1.0)
3. Get your ThingSpeak channel ID and API keys
4. Input the credentials in the esp32 startup webserver

Follow our [ThingSpeak Setup Guide](https://uk.mathworks.com/help/thingspeak/getting-started-with-thingspeak.html) for detailed instructions.

### GitHub Pages Dashboard

This repository includes a web dashboard that can be deployed to GitHub Pages to visualize your sensor data from anywhere:

1. Fork this repository
2. Enable GitHub Pages in your repository settings
3. Update the ThingSpeak channel ID and read API key in the script.js file
4. Access your dashboard at `https://[your-username].github.io/[repository-name]/`

Follow our [GitHub Pages Setup Guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) for detailed instructions.

## Esp32 Code Installation
### Direct Binary Upload:
If you want to get iot thingspeak connectivity running with wifi connectivity features:

1. Download `esp32c3supermini_scd41_sgp41_pms5003_oled_ble_webserver.ino.bin` from this repository
2. Connect your ESP32-C3 Super Mini to your computer
3. Use one of these tools to flash the binary:
   - **ESP Flash Tool**: Upload to address 0x0
   - **esptool.py** (command line): 
     ```
     esptool.py --chip esp32c3 --port [YOUR_COM_PORT] --baud 460800 write_flash 0x0 esp32c3supermini_scd41_sgp41_pms5003_oled_ble_webserver.ino.bin
     ```

### First-Time Setup (WiFi Configuration Portal)
When you first power up the device, it automatically enters setup mode:

- The OLED display will show "SETUP MODE" with connection instructions
- Look for a WiFi network named "EnvMonitor-XXXX" (XXXX = last digits of device MAC address)
- Connect to this network using the password: envmonitor
- Open any web browser and go to: http://192.168.4.1
- You'll see a configuration form to enter:

![setup_webpage_input](https://github.com/benb0jangles/Air_Quality_monitor/blob/main/PICS/Screenshot%202025-05-20%20222617%20(Small).png)

- After saving, the device will restart and connect to your WiFi network
- The OLED will now show sensor readings (or "No sensors" if sensors aren't connected yet)
- Data will upload to Thingspeak every 1 min, and be displayed in your github-pages page (see a live example in the link just below the banner at the top of the readme).

### Re-entering Setup Mode
If you need to change WiFi settings later:
- Method 1 (With Button):
- Press and hold the button for 3+ seconds
- The device will restart in setup mode

Method 2 (Without Button):
- Power-cycle the device (disconnect and reconnect power)
- Within 5 seconds, quickly press the button 3 times
- The device will enter setup mode

Method 3 (Manual Reset):
- If methods 1-2 don't work, you can always re-flash the device with the original binary file.

## Understanding Air Quality Values

### CO2 Levels

| CO2 (ppm) | Classification | Effects |
|-----------|---------------|---------|
| 400-800   | Excellent     | Optimal indoor air quality |
| 800-1000  | Good          | Acceptable air quality |
| 1000-1500 | Moderate      | Noticeable air quality issues |
| >1500     | Poor          | Poor air quality, health concerns |

### VOC and NOx Index

| Index | Classification | Interpretation |
|-------|---------------|----------------|
| 0-50  | Excellent     | Very clean air |
| 50-100| Good          | Good air quality |
| 100-200| Moderate     | Moderate pollution |
| 200-300| Poor         | Poor air quality |
| >300  | Very Poor     | Significant air pollution |

### Particulate Matter (PM2.5)

| PM2.5 (μg/m³) | Classification | Health Implications |
|--------------|----------------|---------------------|
| 0-12         | Good           | Little to no risk |
| 12-35        | Moderate       | Acceptable quality |
| 35-55        | Unhealthy for Sensitive Groups | May affect sensitive groups |
| 55-150       | Unhealthy      | Health effects possible for everyone |
| >150         | Very Unhealthy | Health warnings, emergency conditions |

For more detailed reference values, check our [Air Quality Reference Guide](https://www.who.int/news-room/feature-stories/detail/what-are-the-who-air-quality-guidelines).

## Project Operation

1. **Power up**: Connect the ESP32-C3 to power using the micro usb side
2. **Initialization**: System initializes the sensors and WiFi connection
3. **Measurement**: Sensors continuously measure environmental parameters
4. **Display**: OLED screen shows current readings
5. **Navigation**: Press the button to toggle between:
   - View 1: CO2, temperature, and humidity
   - View 2: VOC and NOx indices
   - View 3: Particulate matter readings
6. **Cloud Upload**: Data is automatically uploaded to ThingSpeak every minute
7. **Web Dashboard**: Access your data remotely through the GitHub Pages dashboard

## Expanding the Project

Some ideas for expanding this project:

- Add a buzzer for alerts when air quality deteriorates
- Integrate with home automation systems (MQTT, Home Assistant)
- Add email or push notifications for air quality warnings
- Create a 3D-printed enclosure for the device
- Add a BME680 sensor for additional gas sensing capabilities
- Implement power management for battery operation

## Troubleshooting

- **No sensor readings**: Check wiring and I2C addresses
- **WiFi connection issues**: Verify WiFi credentials and signal strength
- **ThingSpeak upload fails**: Check API key and channel ID, ensure you're not exceeding rate limits
- **OLED display not working**: Verify I2C address (typically 0x3C or 0x3D)
- **Button not responding**: Check wiring and ensure pin has pull-up resistor enabled

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Sensirion for the SCD41 and SGP41
- Plantower for the PMS5003
- Adafruit for the display libraries
- ThingSpeak for the IoT platform
- All contributors to the open-source libraries used in this project

## Contributors

- benb0jangles - Initial work

## Support

If you find this project helpful, consider starring the repository and sharing it with others!
