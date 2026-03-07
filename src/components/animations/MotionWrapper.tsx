//. @/components/animations/MotionWrapper
// "use client";
import { motion, Variants } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

// --- VARIANTS ---

/** 1. Container: Untuk membungkus list agar anak-anaknya muncul berurutan (stagger) */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

/** 2. FadeInUp: Efek standar muncul dari bawah ke atas */
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/** 3. FadeInDown: Cocok untuk Navbar agar muncul dari atas */
const navVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/** 4. Pop-up (Scale): Efek membal (spring) untuk tombol atau icon */
const scaleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

/** 5. Slide dari Kanan: Bagus untuk elemen side-info */
const slideRightVariants: Variants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** 6. Blur In: Efek dramatis untuk judul besar */
const blurVariants: Variants = {
  hidden: { filter: "blur(10px)", opacity: 0, scale: 0.9 },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

/** 7. 3D Flip: Efek memutar kartu (sangat keren untuk Category Card) */
const flipVariants: Variants = {
  hidden: { rotateX: -90, opacity: 0 },
  visible: {
    rotateX: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "backOut" },
  },
};

/** 8. Perspective Slide: Muncul dengan sudut kemiringan (Modern UI) */
const perspectiveVariants: Variants = {
  hidden: { opacity: 0, rotateY: -15, x: -30 },
  visible: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// --- COMPONENTS ---

interface Props {
  children: ReactNode;
  className?: string;
}

export function FadeInContainer({ children, className }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
      style={{ 
        opacity: mounted ? undefined : 0,
        visibility: mounted ? "visible" : "hidden" 
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInItem({ children, className }: Props) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function FadeInDown({ children, className }: Props) {
  return (
    <motion.div initial="hidden" animate="visible" variants={navVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className }: Props) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className }: Props) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideRightVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function BlurIn({ children, className }: Props) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={blurVariants} className={className}>
      {children}
    </motion.div>
  );
}

/** * KETERANGAN: FlipIn 
 * Digunakan untuk elemen Card agar muncul seperti membuka pintu/lipatan. 
 */
export function FlipIn({ children, className }: Props) {
  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={flipVariants} 
      className={className}
      style={{ perspective: "1000px" }} // Wajib untuk efek 3D
    >
      {children}
    </motion.div>
  );
}

/** * KETERANGAN: PerspectiveIn 
 * Memberikan kesan kedalaman (depth). Bagus untuk layout dashboard atau gallery. 
 */
export function PerspectiveIn({ children, className }: Props) {
  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={perspectiveVariants} 
      className={className}
      style={{ perspective: "1200px" }}
    >
      {children}
    </motion.div>
  );
}

/** * KETERANGAN: Floating (Continuous)
 * Animasi melayang terus menerus (looping). Cocok untuk icon dekorasi atau ilustrasi hero.
 */
export function Floating({ children, className }: Props) {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}