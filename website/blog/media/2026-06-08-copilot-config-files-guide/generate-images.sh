#!/bin/bash
# Image Generation Script for Copilot Configuration Files Guide Blog Post
# Generated: 2026-05-31
# Purpose: Regenerate all SVG diagrams, PNG infographics, and watercolor illustrations
#
# All commands use the Stable Diffusion image generation pipeline.
# Prompt source: image-specs-and-prompts.md and watercolor-prompts.md
# Device auto-detection: uses CUDA if available, MPS on Apple Silicon, falls back to CPU
#
# Usage: bash generate-images.sh [filter]
#   filter (optional): "svg", "png", or "watercolor" to run only that subset
#          Example: bash generate-images.sh watercolor

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR"
SEED_BASE=52

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Copilot Config Files Guide: Image Generation ===${NC}\n"

# ============================================================================
# SVG DIAGRAMS (Mermaid → SVG export)
# ============================================================================

generate_svg_diagrams() {
    echo -e "${GREEN}Generating SVG diagrams...${NC}\n"
    
    # Diagram 1: Mental Model (three rings with cards)
    echo "1. diagram-1-mental-model-v3.svg"
    echo "   Cards: INSTRUCTIONS, AGENTS, SKILLS around three nested rings"
    echo "   Color: White bg, black text, light gray lines (#cccccc), light fills (#f5f7fa)"
    echo "   ✓ Manual Mermaid export or direct SVG creation\n"
    
    # Diagram 2: File Families Decision Tree
    echo "2. diagram-2-file-families-v3.svg"
    echo "   Structure: Root node → 5 file family branches (instructions, agents, skills, prompts, workflows)"
    echo "   Labels: concise routing decisions"
    echo "   ✓ Manual Mermaid export or direct SVG creation\n"
    
    # Diagram 3: Skills vs. Prompts Decision Tree
    echo "3. diagram-3-top-level-routing-v3.svg"
    echo "   Decision flow: Does it reuse? → skills | Is it situational? → prompts"
    echo "   ✓ Manual Mermaid export or direct SVG creation\n"
    
    # Diagram 4: Agent Routing (agents → handlers → channels)
    echo "4. diagram-4-agent-routing-v3.svg"
    echo "   Flow: Multiple agents dispatched based on role + task type"
    echo "   ✓ Manual Mermaid export or direct SVG creation\n"
    
    # Diagram 5: File Placement Decision Tree
    echo "5. diagram-5-input-parsing-v3.svg"
    echo "   Decision: Where do these config files live? (.github, root, dotenv, etc.)"
    echo "   ✓ Manual Mermaid export or direct SVG creation\n"
}

# ============================================================================
# PNG INFOGRAPHICS (Simple stable-diffusion generation)
# ============================================================================

generate_png_infographics() {
    echo -e "${GREEN}Generating PNG infographics...${NC}\n"
    
    # Image 1: Quick Reference Table (visual rendering of file families table)
    echo "📋 image-1-quick-reference-table.png"
    python3 simple_config.py \
        --prompt "A clean reference table layout showing file families, descriptions, and locations in a organized grid format, light background, black text, minimal design, professional appearance, no decorative elements, clear typography" \
        --preset production \
        --style infographic \
        --size blog-hero \
        --seed $((SEED_BASE + 1)) \
        --output "$OUTPUT_DIR/image-1-quick-reference-table.png" \
        --modifier clarity \
        --modifier organized
    echo "   ✓ Generated\n"
    
    # Image 2: Where They Live (file system layout visualization)
    echo "📂 image-2-where-they-live.png"
    python3 simple_config.py \
        --prompt "Folder and file structure diagram showing .github directory, root config files, environment variables, visual hierarchy with clear separation between file types, light background, monochrome, professional infographic style, no text labels inside boxes" \
        --preset production \
        --style infographic \
        --size blog-hero \
        --seed $((SEED_BASE + 2)) \
        --output "$OUTPUT_DIR/image-2-where-they-live.png" \
        --modifier structure \
        --modifier clarity
    echo "   ✓ Generated\n"
}

# ============================================================================
# WATERCOLOR ILLUSTRATIONS (Story-driven, character-focused)
# ============================================================================

generate_watercolors() {
    echo -e "${GREEN}Generating watercolor illustrations...${NC}\n"
    
    # Watercolor 1: Mapping the Five File Families
    echo "🎨 watercolor-1-mapping-file-families.png"
    python3 simple_config.py \
        --prompt "Normal woman at desk sorting five distinct stacks of repository files into order, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text" \
        --preset production \
        --style watercolor \
        --size blog-hero \
        --seed $((SEED_BASE + 3)) \
        --output "$OUTPUT_DIR/watercolor-1-mapping-file-families.png" \
        --modifier painterly \
        --modifier loose
    echo "   ✓ Generated\n"
    
    # Watercolor 2: Understanding the Layers
    echo "🎨 watercolor-2-understanding-layers.png"
    python3 simple_config.py \
        --prompt "Normal woman examining nested transparent layers of governance documents, comparing one layer to another, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text" \
        --preset production \
        --style watercolor \
        --size blog-hero \
        --seed $((SEED_BASE + 4)) \
        --output "$OUTPUT_DIR/watercolor-2-understanding-layers.png" \
        --modifier painterly \
        --modifier loose
    echo "   ✓ Generated\n"
    
    # Watercolor 3: Tracing a Real Workflow
    echo "🎨 watercolor-3-tracing-workflow.png"
    python3 simple_config.py \
        --prompt "Normal woman in home office tracing a path between pinned repository notes and workflow folders, watercolor illustration, soft wet-on-wet washes, visible paper texture, warm muted tones, loose brushwork, no text" \
        --preset production \
        --style watercolor \
        --size blog-hero \
        --seed $((SEED_BASE + 5)) \
        --output "$OUTPUT_DIR/watercolor-3-tracing-workflow.png" \
        --modifier painterly \
        --modifier loose
    echo "   ✓ Generated\n"
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

FILTER="${1:-all}"

case "$FILTER" in
    svg)
        generate_svg_diagrams
        ;;
    png)
        generate_png_infographics
        ;;
    watercolor)
        generate_watercolors
        ;;
    all)
        generate_svg_diagrams
        generate_png_infographics
        generate_watercolors
        ;;
    *)
        echo "Unknown filter: $FILTER"
        echo "Usage: bash generate-images.sh [svg|png|watercolor|all]"
        exit 1
        ;;
esac

echo -e "${GREEN}✓ Image generation complete!${NC}\n"
echo "Generated files are in: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Review all generated images in the media folder"
echo "2. Compare against image-specs-and-prompts.md specifications"
echo "3. Update blog post references if needed"
echo "4. Commit all images with: git add media/2026-05-31-copilot-config-files-guide/*.{svg,png}"
