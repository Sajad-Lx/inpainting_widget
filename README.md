# Inpainting Widget

This is a simple image inpainting widget built using **Vite**, **React**, **Fabric.js**, **Shadcn/UI**, and **TailwindCSS**. The widget allows users to:

- Upload an image.
- Draw a mask over the image using brush tools.
- View the original image and the modified canvas side-by-side.
- Export the modified canvas or the mask as separate images.

Additionally, this project includes a **FastAPI backend** for storing the uploaded images and their metadata.

## How to Run the Project Locally

### Frontend Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sajad-Lx/inpainting_widget.git
   cd inpainting_widget
   ```

2. **Install Dependencies**:
   Ensure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

   This will start a local development server. Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

4. **Build for Production**:
   To build the app for production, run:
   ```bash
   npm run build
   ```

5. **Preview the Build**:
   ```bash
   npm run preview
   ```



### Backend Setup

1. **Navigate to the Backend Directory**:
   ```bash
   cd inpainting_backend
   ```

2. **Install Dependencies**:
   Use the `requirements.txt` file to install dependencies. If the file was generated using Conda, install as follows:
   ```bash
   conda create --name inpainting_backend --file requirements.txt
   conda activate inpainting_backend
   ```

   If using `pip`, install the requirements:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Backend Server**:
   ```bash
   uvicorn app.main:app --reload
   ```

   The backend server will start at [http://localhost:8000](http://localhost:8000).

## Testing Endpoints

Use the provided `endpoints_test.http` file in VSCode with the REST Client extension to test the available endpoints:

1. **Upload Images**:
   - Upload an original image and its mask.

2. **Fetch Image Pairs**:
   - Retrieve image metadata and file paths using their unique ID.



## Libraries Used

### Key Frontend Libraries:

- **Fabric.js**: Used for handling the canvas rendering and drawing functionalities.
- **TailwindCSS**: For styling and creating a responsive UI effortlessly.
- **Shadcn UI**: Provides accessible and customizable UI components like sliders and dialogs.
- **React Colorful**: A lightweight color picker for brush color selection.
- **Lucide React**: A collection of beautiful icons used throughout the UI.

### Key Backend Libraries:

- **FastAPI**: For building the backend API.
- **SQLAlchemy**: ORM for interacting with the SQLite database.
- **Uvicorn**: ASGI server for running the FastAPI app.


## Challenges Faced

One of the primary challenges was ensuring the **canvas size was responsive** across different devices while maintaining aspect ratio and user experience. 

To overcome this, I researched solutions on platforms like **StackOverflow**, **GitHub**, and took guidance from **AI tools** to dynamically adjust the canvas dimensions based on screen size and the uploaded image's aspect ratio.

## Live Demo

[Click here to view the live demo](https://inpainting-widget.vercel.app)

---
