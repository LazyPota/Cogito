

# Cogito Backend

This repository contains the backend of the **Cogito** project, which consists of several main components for handling analytical models, LLM model integration, and the main API server.

## Folder Structure

```
cogito-backend/
├── analytical-setup/           # Analytical model setup (Python)
│   └── fallacy_detector_model/ # Model
│   ├── .gitignore
│   └── app.py                  # Entry point
│
├── llama-setup/               # Integration with LLM (Node.js/Express)
│   ├── node_modules/
│   ├── src/                    # Source code for LLM wrapper/handler
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── server-api/                # Main backend (Node.js/Express)
│   ├── migrations/             # Contains database migration scripts
│   ├── node_modules/
│   ├── scripts/                # Additional scripts
│   ├── src/                    # Main application code
│   ├── .env
│   ├── .env.test
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
```

## Requirements

### analytical-setup (Python)

* Python >= 3.8
* Libraries such as `flask`, `transformers`, etc. (More details in `./fallacy_detector_model/requirements.py`)

### llama-setup & server-api (Node.js)

* Node.js >= 18.x
* npm


## Model Preparation

Before running the project, make sure the model is placed in the following directory:

* **LLM Model** for `llama-setup/models`: [Download on Google Drive](https://drive.google.com/your-llama-model-link](https://drive.google.com/file/d/1s0heZxDeNMjEMmox8Kr996BDyLFTFFxb/view?usp=drive_link)
* **Fallacy Detection Model** for `analytical-setup/fallacy_detector_model`: [Download on Google Drive](https://drive.google.com/your-fallacy-model-link](https://drive.google.com/file/d/1GuTuHzaYnP82evxqF-kUOLq9xfLIDHj1/view?usp=sharing)

Please extract the model file to the appropriate directory after downloading it.

## How to Run

### 1. Run analytical-setup

```bash
cd analytical-setup
pip install -r ./fallacy_detector_model/requirements.py
python app.py
```

### 2. Run llama-setup

```bash
cd llama-setup
npm install
npm start
```

### 3. Run server-api

```bash
cd server-api
npm install
npm run migrate up
npm start
```


## Notes

* Ensure that the `.env` file is available in each component (`llama-setup` and `server-api`).
* For testing, you can use the `.env.test` file in `server-api`.
* The structure may change depending on the final implementation.

## License

MIT License

Translated with DeepL.com (free version)
