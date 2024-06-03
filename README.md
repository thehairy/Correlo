## Getting Started

### 1. Clone the repository and install dependencies

```
git clone https://github.com/thehairy/Correlo.git
cd Correlo
pnpm install
```

### 2. Configure your local environment

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

Add details for the seperate env variables

### 4. Start the application

To run your site locally, use:

```
pnpm run dev
or
npx next dev
```

To run it in production mode, use:

```
pnpm run build
pnpm run start
```
