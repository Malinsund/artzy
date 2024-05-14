# ARTSY - Digital Art Gallery :paintbrush:

This is a digital art gallery where users can share their art and explore works from other artists. The project is built with Express, TypeScript, and React with Styled Components.

## Getting Started

To run the project locally, follow these steps:

1. **Clone the repository**

    ```bash
    git clone <https://github.com/plugga-tech/react-express-user-content-ts-artsy.git>
    ```

2. **Install dependencies**

    Navigate to both the `client` and `server` directories and run:

    ```bash
    cd server
    ```

    ```bash
    npm install
    ```

    ```bash
    cd client
    ```

     ```bash
    npm install
    ```

3. **Set up environment variables**

    Create a `.env` file in the `server` directory and add necessary environment variables such as database username and password.

4. **Start the Express server**

    Navigate to the `server` directory and run:

    ```bash
    npm run dev
    ```

5. **Start the React client**

    Navigate to the `client` directory and run:

    ```bash
    npm run dev
    ```

    This will start the client in development mode and open it in your browser.

## Role Descriptions

### User

- Can create and share their artworks.
- Can explore and interact with artworks from other users.
- Can overwiev their own profile and artwork.
- Can edit their posts.

### Admin

- Has full authority to edit and delete posts from all users.
- Can view a list of all users.
- Can assign someone else as admin.
- Can delete users.

## Technologies

- **Express**: For building and managing the API.
- **TypeScript**: For writing type-safe code.
- **React**: For building the user interface.
- **Styled Components**: For styling components using CSS in JavaScript.



**Krav för godkänt:**

- [x] Git & GitHub har använts
- [x] Projektmappen innehåller en README.md fil (läs ovan för mer info)
- [x] Uppgiften lämnas in i tid!
- [x] Det ska finnas minst två stycken resurser (users & posts)
- [x] Det ska gå att registrera sig, logga in och skapa innehåll som är kopplat till inloggad användare.
- [x] Endast den inloggade användaren får lov att utföra C_UD actions på sitt innehåll.
- [x] Innehållet ska vara synligt för alla besökare på sidan.
- [x] Projektet ska ha stöd för att ladda upp och visa bilder som en del av innehållet.
- [x] Allt innehåll ska sparas i en MongoDB databas.

_Gjorda krav ska kryssar i_

**Krav för väl godkänt:**

- [x] Alla punkter för godkänt är uppfyllda
- [x] Det ska finnas en adminroll i systemet där man som inloggad admin har rättigheten att utföra CRUD operationer på allt innehåll.
- [x] Admins ska ha tillgång till ett gränssnitt som listar alla användare och deras roller. En admin ska från gränssnittet kunna ta bort användare eller ändra dess roll.

_Gjorda krav ska kryssar i_
# artzy
