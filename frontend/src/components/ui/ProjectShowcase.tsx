"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useState } from "react";
import AppLink from "@/components/ui/AppLink";

type Project = {
    title: string;
    category: string;
    image?: string;
    href: string;
};

type ProjectShowcaseProps = {
    projects: Project[];
};

/**
 * ProjectShowcase: Clean grid layout for brands/projects.
 * Features: Simple reveal, clean hover states, no heavy 3D effects.
 */
export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    return (
        <motion.div
            ref={containerRef}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.1 }
                }
            }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {projects.map((project, index) => (
                <ProjectCard key={project.title} project={project} index={index} />
            ))}
        </motion.div>
    );
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div variants={cardVariants} className="h-full">
            <AppLink
                href={project.href}
                className="group block h-full bg-background border border-border overflow-hidden rounded-lg transition-all duration-300 hover:border-foreground/30 hover:shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-subtle">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-subtle via-background to-border transition-transform duration-500 group-hover:scale-105">
                        {/* Brand logo placeholder */}
                        <div className="w-full h-full flex items-center justify-center p-12">
                            <div className="w-full h-full bg-foreground/5 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-foreground/10">
                                <span className="type-h2 text-foreground/30 font-bold tracking-tight transition-colors duration-300 group-hover:text-foreground/50">
                                    {project.title.charAt(0)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-foreground/90 flex flex-col justify-end p-6 transition-all duration-300 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                        <span className="text-background/60 type-ui-xs uppercase tracking-widest mb-2">
                            {project.category}
                        </span>
                        <span className="text-background type-h4 font-medium flex items-center gap-2">
                            View Products →
                        </span>
                    </div>

                    {/* Category badge */}
                    <div className={`absolute top-4 left-4 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                        <span className="px-3 py-1.5 bg-background/90 backdrop-blur-sm type-ui-xs text-muted rounded-full">
                            {project.category}
                        </span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="p-6 space-y-2">
                    <span className="type-ui-xs text-muted block transition-colors duration-300 group-hover:text-foreground">
                        {project.category}
                    </span>
                    <h3 className="type-h4 text-foreground relative inline-block">
                        {project.title}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-foreground origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
                    </h3>
                </div>

                {/* Bottom accent line */}
                <div className="h-0.5 bg-foreground origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
            </AppLink>
        </motion.div>
    );
}
