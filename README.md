# CyberPunk 2077 Breach Protocol Solver

<p align="center">
  <a href="https://nextjs-fastapi-starter.vercel.app/">
    <img src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" height="96">
    <h3 align="center">CyberPunk 2077 Breach Protocol Solver</h3>
  </a>
</p>

<p align="center">Next.js boilerplate that uses <a href="https://fastapi.tiangolo.com/">FastAPI</a> as the API backend.</p>

<br/>

## Introduction

Welcome to the CyberPunk 2077 Breach Protocol Solver! This project combines the power of Next.js for the frontend and FastAPI for the API backend. Cyberpunk 2077 Breach Protocol is a hacking mini-game featured in the video game Cyberpunk 2077. This mini-game simulates the hacking of local network systems protected by ICE (Intrusion Countermeasures Electronics) in the Cyberpunk 2077 universe. With this tool, you can more easily tackle the complex challenges presented in the game tp generate most optimal solution.

## Table of Contents

- [Demo](#demo)
- [Depedencies](#depedencies)
- [Concept](#concept)
- [Features](#features)
- [Development](#development)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)

## Demo

Check out the live demo: [CyberPunk Demo](https://tubes-1-stima.vercel.app/)

## Dependencies

### Backend Dependencies (Python):

- **FastAPI:** Web framework for building APIs with Python.
- **Pydantic:** Library for Declarative Model Definition.
- **Uvicorn:** ASGI server for running FastAPI applications.

### Frontend Dependencies (JavaScript/Node):

- **Next.js:** React framework for building web applications.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Typesript:** JavaScript with syntax for types.
- **React:** JavaScript library for building user interfaces.
- **React-Hot-Toast:** Toast notifications for React applications.

## Concept

### Client Side:

1. The program consists of two pages: a randomize page for input using the randomize function and a file page to upload TXT files.
2. On the file page, users upload a TXT file that is then parsed to input values into data states.
3. All file-related error validations are handled during parsing, and results are displayed through warning errors using toasts for the user interface (UI).
4. On the randomize page, users input all required fields to generate matrices and targets, such as matrix height, width, buffer size, and the number of targets to generate.
5. Validations are also performed to prevent errors when making API requests on the client side.
6. Subsequently, state data is sent through the deployed API at https://fairuzald-tucil-1stima.hf.space/ in production and at http://localhost:8000 during development.
7. The processed data results from the server are captured and displayed on the UI.
8. Users can download the solution, where the data is parsed again into a TXT file. Users can also provide input to change the default filename for downloading results.

### Server Side:

1. The program receives user input, including matrices, target strings with points, maximum buffer size, matrix width, and length.
2. The program then searches for all possible sequence candidates along the maximum buffer size using a stack principle and alternating movement orientations. The program pushes tuple data (x, y) representing coordinates in the matrix into the stack while decrementing the buffer size. It then pops and pushes again until the buffer size is exhausted or becomes zero, resulting in all possible sequence formations with the length of tuple coordinates equal to the buffer size.
3. The program is then evaluated and divided into two optimization cases: mini case evaluation when the buffer size is larger than seven or the matrix column or row is greater than six. For the rest, a more in-depth evaluation is performed.
4. In the mini case evaluation, all token sequence values are combined into a string, as well as all target tokens. The program loops by enumerating the indices and values of the string sequence, then matches them to find the maximum possible score. If a sequence achieves a full point from the target, the program returns immediately. If not, the program re-evaluates to obtain the maximum score and then performs token trimming at the end of the sequence if necessary, returning a sequence with the maximum score and the minimum token length.
5. In the case evaluation, the principle is almost similar to the mini case evaluation, but first, the string sequence is made into a set to eliminate strings with the same sequence token values. This reduces the number of checks for unique sequence values.
6. The final program result returns the sequence containing coordinate arrangements, scores, and token strings from matrix coordinates, along with execution time.

## Features

1. **File Upload:**
   - Easily upload TXT files to the system.
   - Contains information related to matrix size, buffer details, and target data.
   - Streamline the input of crucial data for efficient processing.

2. **Randomize:**
   - Shuffle the content or order of files.
   - Enables randomized insertion of data for diverse testing scenarios.

3. **Download:**
   - Retrieve search results in TXT format.
   - Facilitates easy storage and sharing of outcomes.

## Development

To run the application locally:

### Prerequisites

Before starting the development process, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Python](https://www.python.org/) (3.6 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for managing JavaScript dependencies)
- [Virtualenv](https://virtualenv.pypa.io/) (for creating Python virtual environments)

### 1. Clone the Repository

```bash
git clone https://github.com/fairuzald/Tucil1_13522057
cd Tucil1_13522057
```

### 2. Create and Activate Python Virtual Environment

```bash
python -m venv venv
# For Windows
.\venv\Scripts\activate
# For macOS/Linux
source venv/bin/activate
```

### 3. Navigate to the Source (src) Directory

```bash
cd src

```

### 4. Install Frontend Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 5. Copy .env file from .env.example and fill the values

```bash
NODE_ENV = 'development'
NEXT_PUBLIC_API = 'http://localhost:8000'
```

### 6. Run Next.js Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 7: Open your browser and navigate to

Client-side is running on [localhost:3000](http://localhost:3000), and the server is on [localhost:8000](http://localhost:8000).

## Project Status
Project is complete
| Poin                                              | Completed |
| ------------------------------------------------- | --------- |
| Program berhasil dikompilasi tanpa kesalahan      |     Ya    |
| Program berhasil dijalankan                       |     Ya    |
| Program dapat membacamasukan berkas .txt          |     Ya    |
| Program dapat menghasilkan masukan secara acak    |     Ya    |
| Solusi yang diberikan program optimal             |     Ya    |
| Program dapat menyimpan solusi dalam berkas .txt  |     Ya    |
| Program memiliki GUI                              |     Ya    |

## Room for Improvement

- Optimalization of the Algorithm code
- Adding more features
