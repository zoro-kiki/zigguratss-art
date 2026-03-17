import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, User, ShoppingCart, Star, X, Trophy, Briefcase, Sun, Moon, ArrowRight } from 'lucide-react';
import ZigguratssLogo from './image_11.png';

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: ${props => props.theme.body};
    color: ${props => props.theme.text};
    font-family: 'Montserrat', sans-serif;
    overflow-x: hidden;
    overflow-y: ${props => (props.isModalOpen ? 'hidden' : 'auto')};
    transition: background 0.5s ease;
  }
  ::-webkit-scrollbar { width: 0px; }
`;

const themes = {
  dark: { body: '#050505', text: '#fff', card: '#111', border: 'rgba(212, 175, 55, 0.2)', gold: '#D4AF37' },
  light: { body: '#fcfcfc', text: '#111', card: '#fff', border: 'rgba(0,0,0,0.1)', gold: '#B8860B' }
};

// --- Styled Components ---

const Nav = styled.nav`
  display: flex; justify-content: space-between; align-items: center;
  padding: 15px 20px; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
  position: sticky; top: 0; z-index: 1000; border-bottom: 1px solid #222;
  @media (min-width: 768px) { padding: 20px 60px; }
`;
const FilterWrapper = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 0 20px;
  justify-content: center;
`;

const GlassFilter = styled.div`
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 50px;
  padding: 5px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  &:hover { border-color: #D4AF37; }

  select, input {
    background: transparent;
    border: none;
    color: ${props => props.theme.text};
    outline: none;
    padding: 10px;
    font-size: 0.9rem;
  }
`;
const StackSection = styled.div`
  display: flex; flex-direction: column; align-items: center;
  padding: 20px 0 200px 0;
`;

const CardWrapper = styled.div`
  position: sticky; top: 100px; width: 100%; height: 85vh; 
  display: flex; justify-content: center; margin-bottom: 10vh;
`;

const MainCard = styled(motion.div)`
  width: 95%; max-width: 1200px; height: 100%;
  background: ${props => props.theme.card};
  border-radius: 40px; border: 1px solid ${props => props.theme.border};
  display: flex; flex-direction: column; overflow: hidden;
  box-shadow: 0 -20px 50px rgba(0,0,0,0.8);
  cursor: pointer;
  @media (min-width: 900px) { flex-direction: row; }
`;

const ImageSide = styled.div`
  flex: 1.3; width: 100%; height: 350px; overflow: hidden;
  @media (min-width: 900px) { height: 100%; }
  img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; transition: 1.5s ease; }
  ${MainCard}:hover img { transform: scale(1.1); }
`;

const InfoSide = styled.div`
  flex: 1; padding: 30px; display: flex; flex-direction: column; justify-content: center;
  @media (min-width: 900px) { padding: 60px; }
`;

const GalleryHero = styled(motion.div)`
  position: fixed; inset: 0; background: #000; z-index: 2000; overflow-y: auto;
`;

// --- Data ---
const artistsData = [
  { id: 4, name: "PRASENJIT NATH", loc: "Bongaon, India", cat: "Digital Art", bio: "Based in West Bengal, Prasenjit is a visionary artist with 21+ years of industry experience.", edu: "B.V.A from Rabindra Bharati University", awards: ["International Online Art Award 2024"], img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" },
  { id: 2, name: "SHAHBAZ KHAN", loc: "Mumbai, India", cat: "Oil Painting", bio: "Exploring urban chaos through heavy textures and emotional brushwork.", edu: "Sir J.J. School of Art", awards: ["Mumbai Art Society 2023"], img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" },
  { id: 3, name: "SONALY GANDHI", loc: "Hyderabad, India", cat: "Charcoal Drawing", bio: "Fusing hyper-realism with Indian mythological storytelling.", edu: "JNTU Fine Arts", awards: ["National Merit 2022"], img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
  {
    id: 1,
    name: "PRASOON CHANDRA PODDAR",
    loc: "Bihar, India",
    cat: "Abstraction",
    rating: 5.0,
    tag: "MFA JAMIA MILIA",
    bio: "My art practice is about my visual thinking to see around our society as a conscious mind. I paint different things with different messages, capturing human forms in relation to imagination and reality.",
    edu: "Bachelors & Masters in Fine Arts from Jamia Milia Islamia University",
    awards: ["Year of art work: 2022", "Material used: Paper", "Technique: Acrylic"],
    img: "prasoon.png",
    artworks: [
      {
        title: "AMBITION",
        price: "31,200",
        size: "37 x 45 cm",
        medium: "Acrylic on Paper",
        img: "https://zigguratss.com/storage/artworks/March2024/ambition-197.jpg" // Example direct link
      },
      { title: "DESIRE", price: "31,200", img: "https://picsum.photos/seed/desire/400/500" },
      { title: "FROM THAT WINDOW-I", price: "84,500", img: "https://picsum.photos/seed/window1/400/500" },
    ]
  },
];
const ArtistImage = ({ src, alt }) => {
  const fallback = "https://via.placeholder.com/400x500?text=Artwork+Coming+Soon";
  return (
    <img
      src={src || fallback}
      alt={alt || "Zigguratss Artwork"}
      onError={(e) => { e.target.src = "https://via.placeholder.com/400x500?text=Image+Not+Found"; }}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};
const ArtistPage = () => {
  const [selected, setSelected] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Filtering Logic
  const filteredArtists = artistsData.filter(artist => {
    const matchesCat = filter === 'All' || artist.cat === filter;
    const matchesSearch = artist.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });
  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle isModalOpen={!!selected} />
      <Nav>
        <img src={ZigguratssLogo} alt="Logo" style={{ height: '40px' }} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <motion.div onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ cursor: 'pointer', color: '#D4AF37' }}>
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </motion.div>
          <Search size={22} /><ShoppingCart size={22} />
        </div>
      </Nav>
      {/* PREMIUM FILTERS START */}
      <FilterWrapper>
        <GlassFilter as={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Digital Art">Digital Art</option>
            <option value="Oil Painting">Oil Painting</option>
            <option value="Charcoal Drawing">Charcoal Drawing</option>
          </select>
        </GlassFilter>

        <GlassFilter as={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <select><option>Select Country (India)</option></select>
        </GlassFilter>

        <GlassFilter as={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Search size={18} style={{ opacity: 0.5 }} />
          <input
            type="text"
            placeholder="Search Artist..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </GlassFilter>
      </FilterWrapper>
      {/* PREMIUM FILTERS END */}
      <StackSection>
        {filteredArtists.map((artist, i) => (
          <CardWrapper key={artist.id}>
            <MainCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 - (i * 0.02) }}
              viewport={{ margin: "-100px" }}
              onClick={() => setSelected(artist)}
            >
              <ImageSide><ArtistImage src={artist.img} alt={artist.name} /></ImageSide>
              <InfoSide>
                <span style={{ color: '#D4AF37', letterSpacing: '3px', fontSize: '0.7rem' }}>{artist.cat.toUpperCase()}</span>
                <h1 style={{ fontSize: '3rem', margin: '15px 0', fontFamily: 'serif' }}>{artist.name}</h1>
                <p style={{ color: '#888' }}><MapPin size={16} /> {artist.loc}</p>
                <button style={{ marginTop: '30px', padding: '12px 30px', background: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', borderRadius: '50px', cursor: 'pointer' }}>VIEW FULL GALLERY</button>
              </InfoSide>
            </MainCard>
          </CardWrapper>
        ))}
      </StackSection>

      <AnimatePresence>
  {selected && (
    <GalleryHero 
      initial={{ y: '100%' }} 
      animate={{ y: 0 }} 
      exit={{ y: '100%' }} 
      transition={{ type: 'spring', damping: 25 }}
    >
      {/* 1. HERO SECTION: Full Width Grand Image */}
      <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <ArtistImage src={selected.img} alt={selected.name} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000 15%, transparent 60%)' }} />
        
        {/* Close Button */}
        <X 
          onClick={() => setSelected(null)} 
          style={{ position: 'fixed', top: 30, right: 40, cursor: 'pointer', zIndex: 3000, background: '#D4AF37', borderRadius: '50%', padding: '8px', color: '#000' }} 
          size={40} 
        />
        
        <div style={{ position: 'absolute', bottom: '10%', left: '8%' }}>
          <motion.h1 
            initial={{ x: -100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 0.5, duration: 1 }} 
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: '#D4AF37', fontFamily: 'serif' }}
          >
            {selected.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1 }} 
            style={{ fontSize: '1.5rem', letterSpacing: '8px', opacity: 0.7 }}
          >
            {selected.cat}
          </motion.p>
        </div>
      </div>

      {/* 2. ARTIST CONTENT: Bio & Details */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h2 style={{ color: '#D4AF37', borderBottom: '1px solid #222', paddingBottom: '20px', letterSpacing: '5px' }}>BIOGRAPHY</h2>
            <p style={{ lineHeight: '2.2', fontSize: '1.1rem', color: '#ccc', marginTop: '30px' }}>
              {selected.bio}
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #222' }}>
              <Trophy color="#D4AF37" size={32} />
              <h4 style={{ color: '#D4AF37', marginTop: '10px' }}>Highlights</h4>
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{selected.awards[0]}</p>
            </div>
            <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #222' }}>
              <Briefcase color="#D4AF37" size={32} />
              <h4 style={{ color: '#D4AF37', marginTop: '10px' }}>Education</h4>
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{selected.edu}</p>
            </div>
          </div>
        </div>

        {/* 3. ARTWORKS SECTION: Dynamic Price & Image Handling */}
        <h2 style={{ textAlign: 'center', marginTop: '120px', letterSpacing: '10px', color: '#D4AF37' }}>ARTWORKS FOR SALE</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', marginTop: '60px' }}>
          {selected.artworks ? (
            selected.artworks.map((art, i) => (
              <motion.div whileHover={{ y: -15 }} key={i} style={{ background: '#111', padding: '20px', borderRadius: '20px', textAlign: 'center', border: '1px solid #222' }}>
                <div style={{ height: '320px', border: '4px solid white', overflow: 'hidden', borderRadius: '10px' }}>
                  <ArtistImage src={art.img} alt={art.title} />
                </div>
                <h4 style={{ marginTop: '15px', letterSpacing: '1px' }}>{art.title}</h4>
                <p style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 'bold' }}>₹ {art.price}/-</p>
                <button style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#D4AF37', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  INQUIRE NOW
                </button>
              </motion.div>
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1/-1', opacity: 0.5 }}>Full collection coming soon...</p>
          )}
        </div>
      </div>
    </GalleryHero>
  )}
</AnimatePresence>
    </ThemeProvider>
  );
}

const PageWrapper = styled.div` min-height: 100vh; `;

export default ArtistPage;