// Toilet Paper Magazine Inspired Portfolio
// Interactive gallery with 3D viewing

let THREE = null;

// Load Three.js dynamically
async function loadThreeJS() {
  if (THREE) return THREE;
  try {
    THREE = await import('https://cdn.skypack.dev/three@0.136.0');
    return THREE;
  } catch (e) {
    console.warn('Three.js failed to load, 3D features disabled');
    return null;
  }
}

// Sample portfolio images (replace with your own)
const portfolioItems = [
  { id: 1, color: 'color-1', title: 'Photo 1', type: 'photo', image: './images/photo-1.jpg' },
  { id: 2, color: 'color-2', title: 'Photo 2', type: 'photo', image: './images/photo-2.jpg' },
  { id: 3, color: 'color-3', title: 'Photo 3', type: 'photo', image: './images/photo-3.jpg' },
  { id: 4, color: 'color-4', title: 'Photo 4', type: 'photo', image: './images/photo-4.jpg' },
  { id: 5, color: 'color-5', title: 'Photo 5', type: 'photo', image: './images/photo-5.jpg' },
  { id: 6, color: 'color-1', title: '3D Art', type: '3d' },
];

let currentImageIndex = 0;
let scene3d = null;
let camera3d = null;
let renderer3d = null;
let currentMesh = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initLightbox();
  initScrollAnimations();
  
  // Preload Three.js in background
  loadThreeJS();
});



// Initialize Gallery
function initGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  
  portfolioItems.forEach((item, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = `gallery-item ${item.color}`;
    galleryItem.dataset.index = index;
    galleryItem.dataset.type = item.type;
    
    // Add image if provided
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      galleryItem.appendChild(img);
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    overlay.innerHTML = `<span>VIEW ${item.type.toUpperCase()}</span>`;
    
    galleryItem.appendChild(overlay);
    galleryItem.addEventListener('click', () => openLightbox(index));
    galleryGrid.appendChild(galleryItem);
  });
}

// Initialize Lightbox
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

// Open Lightbox
async function openLightbox(index) {
  currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightbox3d = document.getElementById('lightbox3d');
  const item = portfolioItems[index];
  
  // Show 3D viewer for 3D type items
  if (item.type === '3d') {
    lightboxImg.style.display = 'none';
    lightbox3d.style.display = 'block';
    const color = getColorForClass(item.color);
    await init3DViewer(lightbox3d, color);
  } else {
    lightboxImg.style.display = 'block';
    lightbox3d.style.display = 'none';
    cleanup3D();
    
    // Use actual image or placeholder
    if (item.image) {
      lightboxImg.src = item.image;
    } else {
      const color = getColorForClass(item.color);
      lightboxImg.src = `https://via.placeholder.com/1200x800/${color.replace('#', '')}/ffffff?text=${item.title}`;
    }
  }
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  cleanup3D();
}

// Navigate Lightbox
function navigateLightbox(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) currentImageIndex = portfolioItems.length - 1;
  if (currentImageIndex >= portfolioItems.length) currentImageIndex = 0;
  openLightbox(currentImageIndex);
}

// Get color from class
function getColorForClass(colorClass) {
  const colors = {
    'color-1': '#ff4757',
    'color-2': '#5352ed',
    'color-3': '#ffa502',
    'color-4': '#2ed573',
    'color-5': '#ff6b81',
  };
  return colors[colorClass] || '#ff4757';
}

// Initialize 3D Viewer
async function init3DViewer(container, color) {
  const ThreeLib = await loadThreeJS();
  if (!ThreeLib) {
    container.innerHTML = '<div style="color:white;text-align:center;padding:2rem;">3D viewer not available</div>';
    return;
  }
  THREE = ThreeLib;
  
  cleanup3D();
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Scene
  scene3d = new THREE.Scene();
  scene3d.background = new THREE.Color(0x1a1a1a);
  
  // Camera
  camera3d = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera3d.position.z = 3;
  
  // Renderer
  renderer3d = new THREE.WebGLRenderer({ antialias: true });
  renderer3d.setSize(width, height);
  renderer3d.setPixelRatio(window.devicePixelRatio);
  container.innerHTML = '';
  container.appendChild(renderer3d.domElement);
  
  // Create 3D object (icosahedron for artistic look)
  const geometry = new THREE.IcosahedronGeometry(1.2, 0);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    transparent: true,
    opacity: 0.9,
  });
  
  currentMesh = new THREE.Mesh(geometry, material);
  scene3d.add(currentMesh);
  
  // Add inner solid shape
  const innerGeo = new THREE.IcosahedronGeometry(0.8, 1);
  const innerMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.6,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene3d.add(innerMesh);
  currentMesh.inner = innerMesh;
  
  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene3d.add(ambientLight);
  
  const pointLight1 = new THREE.PointLight(0xffffff, 1);
  pointLight1.position.set(5, 5, 5);
  scene3d.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  pointLight2.position.set(-5, -5, 5);
  scene3d.add(pointLight2);
  
  // Animation
  let rotationSpeed = 0.01;
  
  function animate() {
    requestAnimationFrame(animate);
    
    if (currentMesh) {
      currentMesh.rotation.x += rotationSpeed;
      currentMesh.rotation.y += rotationSpeed * 0.5;
      
      if (currentMesh.inner) {
        currentMesh.inner.rotation.x -= rotationSpeed * 0.7;
        currentMesh.inner.rotation.y -= rotationSpeed * 0.3;
      }
    }
    
    renderer3d.render(scene3d, camera3d);
  }
  
  animate();
  
  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / height) * 2 + 1;
    
    if (currentMesh) {
      currentMesh.rotation.y += mouseX * 0.05;
      currentMesh.rotation.x += mouseY * 0.05;
    }
  });
  
  // Scroll to zoom
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera3d.position.z += e.deltaY * 0.005;
    camera3d.position.z = Math.max(2, Math.min(6, camera3d.position.z));
  }, { passive: false });
}

// Cleanup 3D
function cleanup3D() {
  if (renderer3d) {
    renderer3d.dispose();
    renderer3d.domElement.remove();
  }
  scene3d = null;
  camera3d = null;
  renderer3d = null;
  currentMesh = null;
}

// Scroll Animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.gallery-item, .about-content, .contact h2').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Handle resize
window.addEventListener('resize', () => {
  if (camera3d && renderer3d) {
    const container = document.getElementById('lightbox3d');
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    camera3d.aspect = width / height;
    camera3d.updateProjectionMatrix();
    renderer3d.setSize(width, height);
  }
});
