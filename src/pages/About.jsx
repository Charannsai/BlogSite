import { motion } from 'framer-motion'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

function About() {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-12"
    >
      <motion.div 
        variants={item}
        className="text-center mb-12"
      >
        <div className="relative w-32 h-32 mx-auto mb-6">
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src="https://github.com/charanpathuri.png"
            alt="Charan Sai Pathuri"
            className="rounded-full w-full h-full object-cover shadow-lg"
          />
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-accent/20"
          />
        </div>
        <motion.h1 
          variants={item}
          className="text-3xl font-bold mb-2 dark:text-gray-100"
        >
          Charan Sai Pathuri
        </motion.h1>
        <motion.h2 
          variants={item}
          className="text-xl text-secondary dark:text-gray-400 mb-6"
        >
          Full Stack Developer
        </motion.h2>
        <motion.div 
          variants={item}
          className="flex justify-center gap-6"
        >
          {[
            { icon: FaGithub, href: 'https://github.com/charanpathuri', label: 'GitHub' },
            { icon: FaTwitter, href: 'https://twitter.com/charanpathuri', label: 'Twitter' },
            { icon: FaLinkedin, href: 'https://linkedin.com/in/charanpathuri', label: 'LinkedIn' }
          ].map((social, index) => (
            <motion.a
              key={social.label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary dark:text-gray-400 hover:text-accent dark:hover:text-accent transition-colors"
              aria-label={social.label}
            >
              <social.icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        variants={item}
        className="prose prose-lg dark:prose-invert mx-auto mb-12"
      >
        <p className="text-center text-secondary dark:text-gray-400">
          I am an Engineering student passionate about AI and Software Development.
          Committed to continuous learning to stay ahead in emerging technologies.
        </p>
        <p className="text-center text-secondary dark:text-gray-400">
          Currently Building my side projects and actively learning new technologies.
          I Aspire to contribute to cutting-edge projects that solve real-world problems through technology.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="text-2xl font-semibold text-center mb-8 dark:text-gray-100">Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: '⚛️', name: 'React', color: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: '🟦', name: 'TypeScript', color: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: '🔷', name: 'Next.js', color: 'bg-gray-50 dark:bg-gray-800' },
            { icon: '🎨', name: 'Tailwind', color: 'bg-teal-50 dark:bg-teal-900/20' },
            { icon: '🔋', name: 'Node.js', color: 'bg-green-50 dark:bg-green-900/20' },
            { icon: '🐘', name: 'PostgreSQL', color: 'bg-blue-50 dark:bg-blue-900/20' }
          ].map((tech, index) => (
            <motion.div
              key={tech.name}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${tech.color} p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="text-2xl mb-2">{tech.icon}</div>
              <div className="text-sm font-medium dark:text-gray-300">{tech.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default About