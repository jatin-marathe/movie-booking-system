require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const movies = [
    {
        title: "Dune: Part Two",
        image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        banner: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        genre: ["Action", "Sci-Fi", "Adventure"],
        duration: 166,
        rating: 8.5,
        description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
        releaseYear: 2024,
        language: "English",
        director: "Denis Villeneuve",
        cast: [{ name: "Timothée Chalamet", role: "Paul Atreides" }, { name: "Zendaya", role: "Chani" }],
        isTrending: true,
        isRecommended: true,
        theaters: [
            { name: "PVR Cinemas", location: "Downtown", times: ["10:00 AM", "1:30 PM", "5:00 PM", "9:00 PM"] },
            { name: "INOX Megaplex", location: "Mall Road", times: ["11:00 AM", "3:00 PM", "7:30 PM"] },
            { name: "Cinepolis", location: "City Center", times: ["12:00 PM", "4:00 PM", "8:00 PM"] }
        ]
    },
    {
        title: "Oppenheimer",
        image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        banner: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
        genre: ["Drama", "History", "Thriller"],
        duration: 180,
        rating: 8.9,
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II. A gripping portrayal of genius, ambition, and the weight of moral consequence.",
        releaseYear: 2023,
        language: "English",
        director: "Christopher Nolan",
        cast: [{ name: "Cillian Murphy", role: "J. Robert Oppenheimer" }, { name: "Emily Blunt", role: "Katherine Oppenheimer" }],
        isTrending: false,
        isRecommended: true,
        theaters: [
            { name: "PVR Cinemas", location: "Downtown", times: ["10:30 AM", "2:00 PM", "6:30 PM"] },
            { name: "INOX Megaplex", location: "Mall Road", times: ["11:30 AM", "4:00 PM", "8:30 PM"] }
        ]
    },
    {
        title: "Deadpool & Wolverine",
        image: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        banner: "https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        genre: ["Action", "Comedy", "Superhero"],
        duration: 128,
        rating: 7.8,
        description: "Deadpool is offered a chance to join the Marvel Cinematic Universe but must first convince a reluctant Wolverine to suit up once more. The two anti-heroes must save their universe from destruction.",
        releaseYear: 2024,
        language: "English",
        director: "Shawn Levy",
        cast: [{ name: "Ryan Reynolds", role: "Deadpool" }, { name: "Hugh Jackman", role: "Wolverine" }],
        isTrending: true,
        isRecommended: false,
        theaters: [
            { name: "PVR Cinemas", location: "Downtown", times: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"] },
            { name: "Cinepolis", location: "City Center", times: ["10:00 AM", "1:00 PM", "5:30 PM", "9:00 PM"] }
        ]
    },
    {
        title: "Alien: Romulus",
        image: "https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg",
        banner: "https://image.tmdb.org/t/p/original/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg",
        genre: ["Horror", "Sci-Fi", "Thriller"],
        duration: 119,
        rating: 7.3,
        description: "A group of young space colonizers face the most terrifying life form in the universe when they find themselves trapped in a derelict space station. A return to the roots of the franchise.",
        releaseYear: 2024,
        language: "English",
        director: "Fede Álvarez",
        cast: [{ name: "Cailee Spaeny", role: "Rain Carradine" }, { name: "David Jonsson", role: "Andy" }],
        isTrending: true,
        isRecommended: false,
        theaters: [
            { name: "INOX Megaplex", location: "Mall Road", times: ["12:00 PM", "3:30 PM", "7:00 PM", "10:30 PM"] }
        ]
    },
    {
        title: "Inside Out 2",
        image: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
        banner: "https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MG75UqLl6Vg.jpg",
        genre: ["Animation", "Family", "Comedy"],
        duration: 100,
        rating: 7.9,
        description: "Joy, Sadness, Anger, Fear, and Disgust are joined by new emotions as Riley faces the turbulent years of adolescence. A heartfelt adventure through the landscape of the human mind.",
        releaseYear: 2024,
        language: "English",
        director: "Kelsey Mann",
        cast: [{ name: "Amy Poehler", role: "Joy (voice)" }, { name: "Maya Hawke", role: "Anxiety (voice)" }],
        isTrending: false,
        isRecommended: true,
        theaters: [
            { name: "PVR Cinemas", location: "Downtown", times: ["10:00 AM", "12:30 PM", "3:00 PM", "5:30 PM"] },
            { name: "Cinepolis", location: "City Center", times: ["11:00 AM", "2:00 PM", "4:30 PM"] }
        ]
    },
    {
        title: "Gladiator II",
        image: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
        banner: "https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL6ovhZ.jpg",
        genre: ["Action", "Drama", "History"],
        duration: 148,
        rating: 7.1,
        description: "Years after witnessing the death of the revered hero Maximus at the hands of the corrupt Emperor Commodus, Lucius is forced to enter the Colosseum and must look to his past to find strength.",
        releaseYear: 2024,
        language: "English",
        director: "Ridley Scott",
        cast: [{ name: "Paul Mescal", role: "Lucius" }, { name: "Denzel Washington", role: "Macrinus" }],
        isTrending: false,
        isRecommended: true,
        theaters: [
            { name: "INOX Megaplex", location: "Mall Road", times: ["1:00 PM", "4:30 PM", "8:00 PM"] },
            { name: "PVR Cinemas", location: "Downtown", times: ["11:30 AM", "3:00 PM", "7:00 PM", "10:30 PM"] }
        ]
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log('✅ Database seeded with 6 movies');
    process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
