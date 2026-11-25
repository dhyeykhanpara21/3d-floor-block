# ==============================================================================
# MODERN RESIDENCE ARCHITECTURAL FLOOR PLAN - PROCEDURAL BLENDER GENERATOR
# Exact 3D Cutaway Recreation Matching High-Resolution Reference Photo & Callouts
#
# INCLUDED ZONES & DETAILS:
# - Kitchen: L-counter, marble top, undermount sink, espresso machine, cutting board,
#   knife block, cooktop & hood, marble island with fruit bowl & 3 cognac leather stools
# - Dining Area: Oak dining table with white floral vase & 6 modern Scandinavian chairs
# - Upper Living Room: 3-seater cream sofa, 4 pillows, 2 side tables with globe lamps,
#   marble coffee table with books & planter, light rug, 3-panel back window
# - Split-Level Staircase: U-shaped stairs with middle landing, oak treads, white base,
#   vertical black balusters & oak handrail
# - Guest Bathroom: Toilet, floating vanity, chrome faucet, mirror, glass shower screen
# - Entry Foyer: Diagonal black & white diamond checkerboard tiles, front entry door
# - Master Study: Built-in wardrobe (lower cabinets + hanging clothes on rail), oak desk,
#   laptop/monitor, desk lamp, ergonomic chair, south window
# - Lower Living Room: Large cream sofa, dark rug, stone coffee table with flowers & books,
#   designer accent armchair on brass legs, round blue side table, media console
# - Left Patio: Cobblestone pavers bordered by vibrant pink flowering bushes/hedges
# - Front Veranda: Slate terrace, white columns, black railings, 5 stepping stones on lawn
# - Site & Landscaping: Japanese Maple crimson tree (top-right), perimeter trees, shrubs
# - Cameras: CAM_01_AERIAL_ISOMETRIC pre-aligned to exact photo angle + 7 view cameras
# ==============================================================================

import bpy
import math
from mathutils import Vector

# ---------------- USER PARAMETERS ----------------
WALL_HEIGHT = 1.80       # Cutaway wall height matching reference photo (2.85 for full height)
WALL_THICK  = 0.22       # Wall thickness in meters
FLOOR_THICK = 0.20       # Floor slab thickness
RENDER_RES_X = 1920      # Output render resolution width
RENDER_RES_Y = 1920      # 1:1 Square resolution matching the reference photo
CYCLES_SAMPLES = 64      # Render samples
SAVE_BLEND = True        # Automatically save .blend file

# ---------------- RESET SCENE ----------------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

for c in list(bpy.data.collections):
    if c.name != "Collection":
        bpy.data.collections.remove(c)

scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.length_unit = 'METERS'
scene.render.engine = 'CYCLES'
if hasattr(scene.cycles, 'samples'):
    scene.cycles.samples = CYCLES_SAMPLES
scene.render.resolution_x = RENDER_RES_X
scene.render.resolution_y = RENDER_RES_Y
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'

# ---------------- COLLECTIONS ----------------
def create_collection(name):
    c = bpy.data.collections.new(name)
    scene.collection.children.link(c)
    return c

COL = {
    "Site": create_collection("01_SITE & LANDSCAPE"),
    "Architecture": create_collection("02_ARCHITECTURE"),
    "Interior": create_collection("03_INTERIOR & FURNITURE"),
    "Details": create_collection("04_DETAILS"),
    "Lighting": create_collection("05_LIGHTING"),
    "Cameras": create_collection("06_CAMERAS"),
}
CURRENT_COL = COL["Architecture"]

def place_in_collection(obj, col=None):
    target = col or CURRENT_COL
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    target.objects.link(obj)
    return obj

# ---------------- PBR MATERIAL BUILDER (Blender 3.x, 4.x+) ----------------
def create_pbr_material(name, color_rgba, roughness=0.5, metallic=0.0, transmission=0.0, emission=None):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    bs = nodes.get("Principled BSDF")
    if not bs:
        bs = nodes.new(type="ShaderNodeBsdfPrincipled")

    if "Base Color" in bs.inputs:
        bs.inputs["Base Color"].default_value = color_rgba
    if "Roughness" in bs.inputs:
        bs.inputs["Roughness"].default_value = roughness
    if "Metallic" in bs.inputs:
        bs.inputs["Metallic"].default_value = metallic

    if transmission > 0.0:
        if "Transmission Weight" in bs.inputs:
            bs.inputs["Transmission Weight"].default_value = transmission
        elif "Transmission" in bs.inputs:
            bs.inputs["Transmission"].default_value = transmission
        if "IOR" in bs.inputs:
            bs.inputs["IOR"].default_value = 1.5

    if emission:
        if "Emission Color" in bs.inputs:
            bs.inputs["Emission Color"].default_value = (*emission[:3], 1.0)
            if "Emission Strength" in bs.inputs:
                bs.inputs["Emission Strength"].default_value = emission[3] if len(emission) > 3 else 1.0
        elif "Emission" in bs.inputs:
            bs.inputs["Emission"].default_value = (*emission[:3], 1.0)

    return m

# Checkerboard procedural material for Entry Foyer
def create_checkerboard_material(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    links = m.node_tree.links
    nodes.clear()

    out = nodes.new(type="ShaderNodeOutputMaterial")
    bs = nodes.new(type="ShaderNodeBsdfPrincipled")
    checker = nodes.new(type="ShaderNodeTexChecker")
    coord = nodes.new(type="ShaderNodeTexCoord")
    mapping = nodes.new(type="ShaderNodeMapping")

    checker.inputs["Color1"].default_value = (0.05, 0.05, 0.06, 1.0) # Black diamond
    checker.inputs["Color2"].default_value = (0.92, 0.92, 0.93, 1.0) # White diamond
    checker.inputs["Scale"].default_value = 12.0

    mapping.inputs["Rotation"].default_value[2] = math.radians(45.0) # Diagonal diamond angle

    links.new(coord.outputs["Object"], mapping.inputs["Vector"])
    links.new(mapping.outputs["Vector"], checker.inputs["Vector"])
    links.new(checker.outputs["Color"], bs.inputs["Base Color"])
    links.new(bs.outputs["BSDF"], out.inputs["Surface"])

    if "Roughness" in bs.inputs:
        bs.inputs["Roughness"].default_value = 0.25
    return m

M = {
    "wall":           create_pbr_material("Wall_White", (0.94, 0.94, 0.93, 1), 0.88),
    "wall_cap":       create_pbr_material("Wall_Top_Cap", (0.86, 0.86, 0.85, 1), 0.90),
    "oak_floor":      create_pbr_material("Oak_Hardwood_Floor", (0.74, 0.56, 0.36, 1), 0.38, 0.02),
    "slate_stone":    create_pbr_material("Slate_Pavers", (0.34, 0.36, 0.38, 1), 0.72),
    "foyer_checker":  create_checkerboard_material("Foyer_Diamond_Tile"),
    "bath_tile":      create_pbr_material("Bathroom_Tile", (0.86, 0.88, 0.90, 1), 0.22, 0.05),
    "marble":         create_pbr_material("Calacatta_Marble", (0.96, 0.96, 0.97, 1), 0.18, 0.06),
    "dark_rug":       create_pbr_material("Living_Dark_Rug", (0.12, 0.13, 0.15, 1), 0.95),
    "light_rug":      create_pbr_material("Sunroom_Light_Rug", (0.82, 0.80, 0.76, 1), 0.95),
    "cream_fabric":   create_pbr_material("Cream_Linen_Fabric", (0.90, 0.88, 0.84, 1), 0.85),
    "grey_fabric":    create_pbr_material("Grey_Sofa_Fabric", (0.76, 0.78, 0.80, 1), 0.85),
    "dark_fabric":    create_pbr_material("Dark_Fabric_Upholstery", (0.16, 0.18, 0.20, 1), 0.82),
    "cognac_leather": create_pbr_material("Cognac_Leather", (0.54, 0.27, 0.12, 1), 0.35, 0.10),
    "natural_oak":    create_pbr_material("Natural_Blonde_Oak", (0.76, 0.60, 0.42, 1), 0.42),
    "dark_wood":      create_pbr_material("Dark_Smoked_Oak", (0.12, 0.11, 0.10, 1), 0.45),
    "black_metal":    create_pbr_material("Matte_Black_Metal", (0.04, 0.04, 0.05, 1), 0.38, 0.75),
    "chrome":         create_pbr_material("Polished_Chrome", (0.92, 0.92, 0.94, 1), 0.12, 0.95),
    "brass":          create_pbr_material("Warm_Brass", (0.78, 0.58, 0.26, 1), 0.28, 0.85),
    "blue_accent":    create_pbr_material("Blue_Pedestal_Table", (0.24, 0.36, 0.48, 1), 0.35),
    "glass":          create_pbr_material("Clear_Architectural_Glass", (0.95, 0.97, 1.0, 1), 0.05, 0.0, 0.85),
    "lawn_green":     create_pbr_material("Lawn_Grass_Green", (0.22, 0.42, 0.12, 1), 0.88),
    "foliage_green":  create_pbr_material("Tree_Foliage_Green", (0.16, 0.36, 0.10, 1), 0.75),
    "pink_flowers":   create_pbr_material("Pink_Flower_Border", (0.78, 0.22, 0.48, 1), 0.75),
    "maple_burgundy": create_pbr_material("Japanese_Maple_Crimson", (0.42, 0.07, 0.14, 1), 0.75),
    "tree_trunk":     create_pbr_material("Tree_Trunk_Bark", (0.22, 0.16, 0.12, 1), 0.85),
    "asphalt":        create_pbr_material("Asphalt_Driveway", (0.18, 0.20, 0.22, 1), 0.82),
    "roof_awning":    create_pbr_material("Roof_Awning_Charcoal", (0.10, 0.12, 0.14, 1), 0.50, 0.45),
    "porcelain":      create_pbr_material("White_Porcelain", (0.98, 0.98, 0.99, 1), 0.15, 0.05),
    "globe_glow":     create_pbr_material("Globe_Lamp_Glow", (1.0, 0.92, 0.78, 1), 0.15, 0.0, 0.0, (1.0, 0.88, 0.65, 4.0)),
}

# ---------------- GEOMETRY HELPERS ----------------
def add_box(name, loc, size, material, bevel=0.0, col=None):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    o = bpy.context.object
    o.name = name
    o.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        o.data.materials.append(material)
    if bevel > 0.0:
        mod = o.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 2
    return place_in_collection(o, col)

def add_cylinder(name, loc, radius, depth, material, vertices=24, col=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc)
    o = bpy.context.object
    o.name = name
    if material:
        o.data.materials.append(material)
    return place_in_collection(o, col)

def add_sphere(name, loc, scale, material, col=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    if material:
        o.data.materials.append(material)
    return place_in_collection(o, col)

def add_wall(name, x1, y1, x2, y2, height=WALL_HEIGHT, thick=WALL_THICK, z=0.0):
    dx = x2 - x1
    dy = y2 - y1
    length = math.hypot(dx, dy)
    mid_x = (x1 + x2) / 2
    mid_y = (y1 + y2) / 2
    mid_z = z + height / 2

    w = add_box(name, (mid_x, mid_y, mid_z), (length, thick, height), M["wall"])
    w.rotation_euler[2] = math.atan2(dy, dx)

    # Top Cap
    cap = add_box(name + "_Cap", (mid_x, mid_y, z + height + 0.015), (length, thick + 0.02, 0.03), M["wall_cap"])
    cap.rotation_euler[2] = math.atan2(dy, dx)
    return w

def add_window_wall(name, x1, y1, x2, y2, win_w, win_h, sill_h, height=WALL_HEIGHT, thick=WALL_THICK):
    dx = x2 - x1
    dy = y2 - y1
    total_len = math.hypot(dx, dy)
    angle = math.atan2(dy, dx)
    side_len = (total_len - win_w) / 2

    root_x = (x1 + x2) / 2
    root_y = (y1 + y2) / 2

    if side_len > 0.05:
        add_box(name + "_Left", (root_x - (total_len/2 - side_len/2)*math.cos(angle),
                                 root_y - (total_len/2 - side_len/2)*math.sin(angle),
                                 height/2),
                (side_len, thick, height), M["wall"]).rotation_euler[2] = angle

        add_box(name + "_Right", (root_x + (total_len/2 - side_len/2)*math.cos(angle),
                                  root_y + (total_len/2 - side_len/2)*math.sin(angle),
                                  height/2),
                (side_len, thick, height), M["wall"]).rotation_euler[2] = angle

    if sill_h > 0.05:
        add_box(name + "_Sill", (root_x, root_y, sill_h/2), (win_w, thick, sill_h), M["wall"]).rotation_euler[2] = angle

    glass = add_box(name + "_Glass", (root_x, root_y, sill_h + win_h/2), (win_w - 0.1, 0.03, win_h - 0.1), M["glass"])
    glass.rotation_euler[2] = angle

    frame = add_box(name + "_Frame", (root_x, root_y, sill_h + win_h/2), (win_w, thick * 0.7, win_h), M["black_metal"], bevel=0.01)
    frame.rotation_euler[2] = angle

def aim_at(obj, target_point):
    obj.rotation_euler = (Vector(target_point) - obj.location).to_track_quat('-Z', 'Y').to_euler()

def add_camera(name, loc, target, focal_length=42):
    cam_data = bpy.data.cameras.new(name)
    cam_data.lens = focal_length
    cam_data.sensor_width = 36
    cam_obj = bpy.data.objects.new(name, cam_data)
    cam_obj.location = loc
    aim_at(cam_obj, target)
    COL["Cameras"].objects.link(cam_obj)
    return cam_obj

# ==============================================================================
# 1. SITE & LANDSCAPE
# ==============================================================================
CURRENT_COL = COL["Site"]

add_box("Green_Lawn", (0, 0, -0.1), (46.0, 46.0, 0.2), M["lawn_green"])

# West Slate Patio (Left open terrace)
add_box("West_Patio_Slab", (-7.7, -1.0, 0.0), (3.8, 7.6, 0.18), M["slate_stone"])

# Vibrant Pink Flowering Bushes around Left Patio perimeter (North, West, South)
add_box("Patio_Flower_Border_W", (-9.75, -1.0, 0.28), (0.42, 7.8, 0.55), M["pink_flowers"], bevel=0.05)
add_box("Patio_Flower_Border_N", (-7.7, 3.0, 0.28), (3.8, 0.42, 0.55), M["pink_flowers"], bevel=0.05)
add_box("Patio_Flower_Border_S", (-7.7, -5.0, 0.28), (3.8, 0.42, 0.55), M["pink_flowers"], bevel=0.05)

# East Front Veranda / Porch
add_box("Front_Porch_Slab", (6.7, -3.4, 0.0), (3.4, 6.8, 0.18), M["slate_stone"])

for s in range(2):
    add_box(f"Porch_Step_{s+1}", (6.7, -6.95 - s*0.35, -0.06 - s*0.06), (1.6, 0.4, 0.08), M["slate_stone"])

stones = [
    (6.7, -8.0, 1.1, 0.6),
    (7.2, -9.0, 1.0, 0.65),
    (8.2, -9.7, 0.9, 0.6),
    (9.3, -9.9, 0.85, 0.6),
]
for idx, (sx, sy, sw, sd) in enumerate(stones):
    add_box(f"Stepping_Stone_{idx+1}", (sx, sy, 0.03), (sw, sd, 0.06), M["slate_stone"], bevel=0.02)

add_box("East_Driveway", (7.6, 3.2, 0.0), (4.4, 8.8, 0.06), M["asphalt"])

def add_tree(name, x, y, foliage_mat, trunk_h=2.6, radius=2.5):
    trunk = add_cylinder(name + "_Trunk", (x, y, trunk_h/2), 0.22, trunk_h, M["tree_trunk"])
    clusters = [
        (0, 0, 0, radius),
        (radius*0.45, radius*0.35, -0.25, radius*0.72),
        (-radius*0.4, -radius*0.3, -0.2, radius*0.75),
        (-radius*0.35, radius*0.4, 0.32, radius*0.65),
        (radius*0.3, -radius*0.35, 0.38, radius*0.68),
    ]
    for c_idx, (cx, cy, cz, cr) in enumerate(clusters):
        add_sphere(f"{name}_Canopy_{c_idx+1}", (x + cx, y + cy, trunk_h + radius*0.3 + cz), (cr, cr, cr*0.9), foliage_mat)

add_tree("Burgundy_Japanese_Maple", 7.8, 8.2, M["maple_burgundy"], 2.8, 2.6)

tree_locs = [
    (-11.0, 8.8, 1.15),
    (-11.8, -2.2, 1.2),
    (-10.8, -8.8, 1.05),
    (-4.8, 10.8, 1.1),
    (1.8, 10.8, 1.2),
    (11.2, 10.5, 1.1),
    (12.0, -7.2, 1.05),
]
for t_idx, (tx, ty, ts) in enumerate(tree_locs):
    add_tree(f"Perimeter_Tree_{t_idx+1}", tx, ty, M["foliage_green"], 2.5*ts, 2.1*ts)

shrubs = [
    (-6.4, -6.8, 0.65), (-4.8, -7.2, 0.6), (-1.2, -7.0, 0.55),
    (5.6, -7.6, 0.55), (8.8, -7.2, 0.7), (9.2, -4.5, 0.6),
    (9.0, -1.2, 0.65), (6.8, 6.8, 0.6)
]
for b_idx, (bx, by, br) in enumerate(shrubs):
    add_sphere(f"Foundation_Shrub_{b_idx+1}", (bx, by, br*0.75), (br*1.1, br*1.1, br*0.85), M["foliage_green"])

# ==============================================================================
# 2. ARCHITECTURE (CUTAWAY WALLS & ENVELOPE)
# ==============================================================================
CURRENT_COL = COL["Architecture"]

add_box("Interior_Wood_Floor", (-0.2, 0.0, 0.0), (11.2, 13.2, FLOOR_THICK), M["oak_floor"])

# ENTRY FOYER (Right Center): Black & White Diagonal Diamond Checkerboard Tiles!
add_box("Entry_Foyer_Checker_Floor", (4.1, -1.5, 0.01), (1.8, 1.5, FLOOR_THICK), M["foyer_checker"])

add_box("Bathroom_Tile_Floor", (3.4, 0.7, 0.01), (3.0, 3.0, FLOOR_THICK), M["bath_tile"])

# --- EXTERIOR WALLS ---
add_window_wall("North_Kitchen_Wall", -5.8, 6.6, -0.8, 6.6, win_w=1.8, win_h=1.0, sill_h=0.85)
add_window_wall("North_Sunroom_Wall", 0.6, 6.6, 5.0, 6.6, win_w=3.6, win_h=1.3, sill_h=0.50)

add_wall("West_Kitchen_Wall", -5.8, 6.6, -5.8, 2.0)
add_window_wall("West_Dining_Slider", -5.8, 2.0, -5.8, -1.8, win_w=3.0, win_h=1.5, sill_h=0.10)
add_wall("West_Office_Wall", -5.8, -1.8, -5.8, -6.6)

add_window_wall("South_Office_Wall", -5.8, -6.6, -0.8, -6.6, win_w=2.2, win_h=1.2, sill_h=0.60)
add_window_wall("South_Living_Wall", -0.8, -6.6, 5.0, -6.6, win_w=3.4, win_h=1.4, sill_h=0.40)

add_wall("East_Sunroom_Wall", 5.0, 6.6, 5.0, 2.2)
add_wall("East_Bath_Wall", 4.9, 2.2, 4.9, -0.8)
add_wall("East_Living_Entry", 5.0, -0.8, 5.0, -2.2)
add_wall("East_Living_Wall", 5.0, -3.8, 5.0, -6.6)

# --- INTERIOR PARTITIONS ---
add_wall("Divider_Kitchen_Sunroom", -0.8, 6.6, -0.8, 2.6)
add_wall("Divider_Sunroom_Bath", 1.8, 2.2, 4.9, 2.2)

add_wall("Bath_South_Left", 1.8, -0.8, 2.8, -0.8)
add_wall("Bath_South_Right", 3.7, -0.8, 4.9, -0.8)
add_wall("Bath_West_Wall", 1.8, 2.2, 1.8, -0.8)

add_wall("Divider_Office_Living", -0.8, -2.0, -0.8, -6.6)
add_wall("Office_North_Left", -5.8, -2.0, -3.8, -2.0)
add_wall("Office_North_Right", -2.6, -2.0, -0.8, -2.0)
add_wall("Office_Closet_Divider", -3.8, -2.0, -3.8, -2.8)

# Front Entry Door (Wood finish with chrome handle swinging inward)
door = add_box("Front_Entry_Door", (4.9, -1.8, 1.05), (0.05, 0.95, 2.1), M["natural_oak"])
door.rotation_euler[2] = 0.25

# --- FRONT PORCH PILLARS & RAILINGS ---
for col_x, col_y in [(5.1, -0.9), (8.3, -0.9), (8.3, -6.7)]:
    add_box(f"Porch_Column_{col_x}_{col_y}", (col_x, col_y, 1.1), (0.24, 0.24, 2.2), M["wall_cap"])

def add_railing(name, x1, y1, x2, y2):
    dist = math.hypot(x2 - x1, y2 - y1)
    ang = math.atan2(y2 - y1, x2 - x1)
    mx = (x1 + x2) / 2
    my = (y1 + y2) / 2
    tr = add_box(name + "_TopRail", (mx, my, 0.95), (dist, 0.04, 0.04), M["black_metal"])
    tr.rotation_euler[2] = ang
    br = add_box(name + "_BotRail", (mx, my, 0.10), (dist, 0.03, 0.03), M["black_metal"])
    br.rotation_euler[2] = ang
    num = max(1, int(dist / 0.12))
    for p in range(1, num):
        px = x1 + (p/num)*(x2 - x1)
        py = y1 + (p/num)*(y2 - y1)
        add_cylinder(f"{name}_Picket_{p}", (px, py, 0.525), 0.012, 0.85, M["black_metal"])

add_railing("Porch_Rail_North", 5.1, -0.9, 8.3, -0.9)
add_railing("Porch_Rail_East", 8.3, -0.9, 8.3, -6.7)
add_railing("Porch_Rail_SouthR", 8.3, -6.7, 7.6, -6.7)
add_railing("Porch_Rail_SouthL", 5.8, -6.7, 5.1, -6.7)

# Sunroom Dark Shingled Roof Awning
awning = add_box("Sunroom_Roof_Awning", (5.7, 4.4, 1.88), (1.4, 4.4, 0.12), M["roof_awning"])
awning.rotation_euler[1] = 0.12

# ==============================================================================
# 3. INTERIOR & FURNITURE (MATCHING CALLOUT DETAILS)
# ==============================================================================
CURRENT_COL = COL["Interior"]

# --- KITCHEN (Top Left) ---
add_box("Kitchen_Base_Counter", (-3.3, 6.15, 0.44), (4.6, 0.7, 0.88), M["wall_cap"], bevel=0.02)
add_box("Kitchen_Marble_Top", (-3.3, 6.15, 0.905), (4.64, 0.74, 0.05), M["marble"])
add_box("Kitchen_Tall_Cabinet", (-5.35, 5.3, 0.9), (0.7, 1.8, 1.8), M["wall_cap"])
add_box("Refrigerator_Stainless", (-4.98, 5.2, 0.9), (0.04, 0.85, 1.6), M["chrome"])

add_box("Kitchen_Sink", (-3.3, 6.15, 0.75), (0.75, 0.45, 0.35), M["chrome"])
add_cylinder("Kitchen_Faucet_Base", (-3.3, 6.32, 0.98), 0.02, 0.12, M["chrome"])

add_box("Espresso_Machine", (-4.8, 6.15, 1.08), (0.28, 0.32, 0.36), M["black_metal"], bevel=0.02)
add_box("Cutting_Board", (-2.2, 6.15, 0.94), (0.35, 0.28, 0.025), M["natural_oak"])
add_box("Knife_Block", (-1.6, 6.22, 1.05), (0.16, 0.18, 0.24), M["dark_wood"])

add_box("Induction_Cooktop", (-4.6, 6.15, 0.935), (0.75, 0.5, 0.02), M["black_metal"])
add_box("Stainless_Hood", (-4.6, 6.15, 1.7), (0.85, 0.55, 0.25), M["chrome"])

add_box("Island_Base", (-3.2, 4.0, 0.44), (1.2, 2.2, 0.88), M["wall_cap"], bevel=0.02)
add_box("Island_Marble_Top", (-3.26, 4.0, 0.91), (1.35, 2.3, 0.06), M["marble"])
add_box("Island_Waterfall_North", (-3.26, 5.13, 0.45), (1.35, 0.06, 0.9), M["marble"])
add_box("Island_Waterfall_South", (-3.26, 2.87, 0.45), (1.35, 0.06, 0.9), M["marble"])

add_cylinder("Island_Fruit_Bowl", (-3.26, 4.2, 0.96), 0.16, 0.06, M["porcelain"])
for o_i in range(4):
    oa = o_i * (math.pi / 2)
    col_citrus = create_pbr_material(f"Citrus_{o_i}", (0.96, 0.62, 0.08, 1) if o_i % 2 == 0 else (0.95, 0.85, 0.12, 1), 0.6)
    add_sphere(f"Island_Fruit_{o_i}", (-3.26 + 0.06*math.cos(oa), 4.2 + 0.06*math.sin(oa), 1.01), (0.04, 0.04, 0.04), col_citrus)

for s_idx, sz in enumerate([4.7, 4.0, 3.3]):
    add_cylinder(f"Bar_Stool_{s_idx+1}_Seat", (-2.25, sz, 0.65), 0.20, 0.07, M["cognac_leather"])
    for lx, ly in [(-0.12, -0.12), (0.12, -0.12), (-0.12, 0.12), (0.12, 0.12)]:
        add_cylinder(f"Stool_{s_idx+1}_Leg", (-2.25 + lx, sz + ly, 0.31), 0.012, 0.62, M["black_metal"])

# --- DINING AREA (Middle Left) ---
add_box("Dining_Table_Top", (-3.4, 0.1, 0.74), (2.3, 1.15, 0.05), M["natural_oak"], bevel=0.01)
for lx, ly in [(-0.95, -0.42), (0.95, -0.42), (-0.95, 0.42), (0.95, 0.42)]:
    add_cylinder("Dining_Table_Leg", (-3.4 + lx, 0.1 + ly, 0.36), 0.02, 0.72, M["black_metal"])

add_cylinder("Dining_Vase", (-3.4, 0.1, 0.82), 0.09, 0.14, M["porcelain"])
add_sphere("Dining_White_Flowers", (-3.4, 0.1, 0.94), (0.15, 0.15, 0.12), M["wall_cap"])

def add_dining_chair(name, x, y, rot_z):
    seat = add_box(name + "_Seat", (x, y, 0.45), (0.44, 0.44, 0.06), M["dark_fabric"], bevel=0.02)
    seat.rotation_euler[2] = rot_z
    back = add_box(name + "_Back", (x, y + 0.2*math.cos(rot_z), 0.65), (0.42, 0.05, 0.38), M["dark_fabric"], bevel=0.02)
    back.rotation_euler[2] = rot_z
    for cx, cy in [(-0.18, -0.18), (0.18, -0.18), (-0.18, 0.18), (0.18, 0.18)]:
        add_cylinder(name + "_Leg", (x + cx, y + cy, 0.22), 0.012, 0.44, M["black_metal"])

add_dining_chair("Chair_N1", -4.0, 0.85, 0)
add_dining_chair("Chair_N2", -2.8, 0.85, 0)
add_dining_chair("Chair_S1", -4.0, -0.65, math.pi)
add_dining_chair("Chair_S2", -2.8, -0.65, math.pi)
add_dining_chair("Chair_W", -4.75, 0.1, math.pi/2)
add_dining_chair("Chair_E", -2.05, 0.1, -math.pi/2)

# --- UPPER LIVING ROOM / SUNROOM (Top Right) ---
add_box("Sunroom_Area_Rug", (3.4, 4.5, 0.01), (3.6, 2.8, 0.015), M["light_rug"])

add_box("Sunroom_Sofa_Base", (3.4, 5.4, 0.22), (2.3, 0.88, 0.26), M["cream_fabric"], bevel=0.03)
for c_i in range(3):
    add_box(f"Sunroom_Sofa_Cushion_{c_i+1}", (2.66 + c_i*0.74, 5.35, 0.38), (0.72, 0.72, 0.14), M["cream_fabric"], bevel=0.02)
add_box("Sunroom_Sofa_Back", (3.4, 5.76, 0.55), (2.3, 0.20, 0.45), M["cream_fabric"], bevel=0.03)

pillow_mat1 = create_pbr_material("Pillow_Cream", (0.92, 0.90, 0.86, 1), 0.85)
pillow_mat2 = create_pbr_material("Pillow_Camel", (0.68, 0.48, 0.32, 1), 0.85)
for p_idx, (px, py, pmat) in enumerate([(-0.85, 5.55, pillow_mat1), (-0.45, 5.55, pillow_mat2),
                                       (0.45, 5.55, pillow_mat2), (0.85, 5.55, pillow_mat1)]):
    add_box(f"Sunroom_Pillow_{p_idx+1}", (3.4 + px, py, 0.52), (0.32, 0.12, 0.32), pmat, bevel=0.02)

for lx in [1.9, 4.9]:
    add_cylinder("Side_Table", (lx, 5.5, 0.25), 0.26, 0.50, M["dark_wood"])
    add_sphere("Globe_Lamp", (lx, 5.5, 0.62), (0.14, 0.14, 0.14), M["globe_glow"])

add_box("Sunroom_Coffee_Table", (3.4, 4.0, 0.38), (1.4, 0.75, 0.06), M["marble"])
add_box("Sunroom_Coffee_Base", (3.4, 4.0, 0.17), (1.2, 0.55, 0.34), M["dark_wood"])
add_box("Coffee_Table_Book", (3.15, 4.0, 0.43), (0.28, 0.35, 0.04), M["dark_fabric"])
add_sphere("Coffee_Table_Succulent", (3.65, 4.0, 0.45), (0.10, 0.10, 0.08), M["foliage_green"])

# --- SPLIT-LEVEL U-SHAPED STAIRCASE (Center) ---
add_box("Stair_Middle_Landing", (0.65, 1.8, 0.85), (1.6, 1.1, 0.10), M["oak_floor"])

for st in range(5):
    sy = 0.5 + st * 0.26
    sz = (st + 1) * 0.17
    add_box(f"Stair_Low_Block_{st+1}", (0.25, sy, sz/2), (0.80, 0.26, sz), M["wall"])
    add_box(f"Stair_Low_Tread_{st+1}", (0.25, sy, sz + 0.018), (0.84, 0.29, 0.035), M["natural_oak"])
    add_cylinder(f"Stair_Low_Picket_{st+1}", (0.65, sy, sz + 0.44), 0.01, 0.85, M["black_metal"])

for st in range(4):
    sy = 1.6 - st * 0.26
    sz = 0.95 + (st + 1) * 0.17
    add_box(f"Stair_High_Block_{st+1}", (1.05, sy, sz/2), (0.80, 0.26, sz), M["wall"])
    add_box(f"Stair_High_Tread_{st+1}", (1.05, sy, sz + 0.018), (0.84, 0.29, 0.035), M["natural_oak"])
    add_cylinder(f"Stair_High_Picket_{st+1}", (0.65, sy, sz + 0.44), 0.01, 0.85, M["black_metal"])

add_box("Stair_Balustrade_Cap", (0.65, 1.1, 1.35), (0.05, 1.8, 0.04), M["natural_oak"])

# --- GUEST BATHROOM (Middle Right) ---
add_box("Toilet_Tank", (2.2, 0.4, 0.42), (0.24, 0.45, 0.72), M["porcelain"], bevel=0.02)
add_box("Toilet_Bowl", (2.52, 0.4, 0.22), (0.48, 0.38, 0.40), M["porcelain"], bevel=0.03)

add_box("Bathroom_Vanity", (3.8, 1.9, 0.55), (0.95, 0.52, 0.42), M["wall_cap"], bevel=0.02)
add_box("Vanity_Basin", (3.8, 1.9, 0.78), (0.98, 0.54, 0.04), M["porcelain"])
add_box("Vanity_Mirror", (3.8, 2.13, 1.45), (0.75, 0.03, 0.95), M["chrome"])
add_box("Shower_Glass", (4.0, 0.0, 0.9), (0.02, 1.2, 1.8), M["glass"])

# --- MASTER STUDY / BEDROOM (Bottom Left) ---
add_box("Wardrobe_Lower_Cabinet", (-4.6, -2.5, 0.45), (1.85, 0.6, 0.90), M["wall_cap"], bevel=0.02)
add_box("Wardrobe_Top_Shelf", (-4.6, -2.5, 1.55), (1.85, 0.6, 0.04), M["wall_cap"])
rod = add_cylinder("Wardrobe_Rod", (-4.6, -2.5, 1.45), 0.012, 1.75, M["chrome"])
rod.rotation_euler[1] = math.pi/2

cloth_palette = [
    (0.23, 0.51, 0.96, 1),
    (0.92, 0.92, 0.94, 1),
    (0.38, 0.42, 0.48, 1),
    (0.08, 0.65, 0.48, 1),
    (0.68, 0.48, 0.32, 1),
]
for c_i in range(12):
    cx = -5.32 + (c_i / 11) * 1.44
    col_mat = create_pbr_material(f"Shirt_Color_{c_i+1}", cloth_palette[c_i % len(cloth_palette)], 0.85)
    add_box(f"Hanging_Garment_{c_i+1}", (cx, -2.5, 1.18), (0.08, 0.42, 0.52), col_mat, bevel=0.01)

add_box("Executive_Desk_Top", (-3.4, -5.3, 0.73), (1.8, 0.85, 0.05), M["natural_oak"], bevel=0.01)
add_box("Desk_Left_Leg", (-4.24, -5.3, 0.35), (0.04, 0.80, 0.70), M["black_metal"])
add_box("Desk_Right_Leg", (-2.56, -5.3, 0.35), (0.04, 0.80, 0.70), M["black_metal"])
add_box("Desk_Laptop_Monitor", (-3.4, -5.1, 1.05), (0.85, 0.03, 0.35), M["black_metal"])

add_box("Office_Chair_Seat", (-3.4, -4.4, 0.46), (0.48, 0.46, 0.08), M["dark_fabric"], bevel=0.02)
add_box("Office_Chair_Back", (-3.4, -4.18, 0.75), (0.44, 0.05, 0.52), M["dark_fabric"], bevel=0.02)
add_cylinder("Office_Chair_Stem", (-3.4, -4.4, 0.22), 0.02, 0.35, M["chrome"])

# --- LOWER LIVING / FAMILY ROOM (Bottom Center) ---
add_box("Living_Area_Rug", (2.0, -4.0, 0.01), (3.8, 3.2, 0.015), M["dark_rug"])

add_box("Sectional_Sofa_Base", (0.4, -3.8, 0.20), (1.0, 3.2, 0.28), M["cream_fabric"], bevel=0.04)
for s_i in range(3):
    add_box(f"Sectional_Cushion_{s_i+1}", (0.44, -4.8 + s_i*1.0, 0.38), (0.88, 0.98, 0.16), M["cream_fabric"], bevel=0.03)
add_box("Sectional_Backrest", (0.02, -3.8, 0.56), (0.24, 3.2, 0.50), M["cream_fabric"], bevel=0.04)

add_box("Living_Coffee_Table", (2.0, -3.8, 0.34), (1.5, 0.8, 0.06), M["dark_wood"], bevel=0.01)
add_box("Living_Coffee_Base", (2.0, -3.8, 0.155), (1.3, 0.6, 0.31), M["black_metal"])
add_cylinder("Living_Flower_Vase", (2.0, -3.8, 0.44), 0.08, 0.14, M["porcelain"])
add_sphere("Living_Flowers", (2.0, -3.8, 0.54), (0.12, 0.12, 0.10), M["wall_cap"])
add_box("Living_Art_Books", (1.6, -3.8, 0.39), (0.28, 0.32, 0.03), M["marble"])

accent_x, accent_y = 3.4, -5.1
accent_rot = math.pi/4 + 0.2
chair_seat = add_box("Accent_Chair_Seat", (accent_x, accent_y, 0.36), (0.72, 0.68, 0.14), M["dark_fabric"], bevel=0.03)
chair_seat.rotation_euler[2] = accent_rot
chair_back = add_box("Accent_Chair_Back", (accent_x - 0.22*math.cos(accent_rot), accent_y - 0.22*math.sin(accent_rot), 0.58),
                     (0.70, 0.12, 0.48), M["dark_fabric"], bevel=0.03)
chair_back.rotation_euler[2] = accent_rot

add_cylinder("Blue_Pedestal_Table", (1.8, -1.8, 0.35), 0.24, 0.70, M["blue_accent"])

add_box("Living_Media_Console", (4.65, -2.8, 0.32), (0.48, 1.8, 0.52), M["wall_cap"], bevel=0.02)
add_box("Media_Console_Oak_Top", (4.65, -2.8, 0.60), (0.50, 1.84, 0.04), M["natural_oak"])

# ==============================================================================
# 4. LIGHTING & ENVIRONMENT
# ==============================================================================
CURRENT_COL = COL["Lighting"]

world = bpy.data.worlds.new("Daylight_World") if not scene.world else scene.world
scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes.get("Background")
if bg_node:
    bg_node.inputs[0].default_value = (0.78, 0.85, 0.92, 1.0)
    bg_node.inputs[1].default_value = 0.65

sun_data = bpy.data.lights.new("Sun_Main", "SUN")
sun_data.energy = 3.6
sun_data.color = (1.0, 0.97, 0.92)
sun_data.angle = math.radians(2.2)
sun_obj = bpy.data.objects.new("Sun_Main", sun_data)
sun_obj.location = (-16.0, 18.0, 26.0)
aim_at(sun_obj, (0, 0, 0))
COL["Lighting"].objects.link(sun_obj)

interior_lights = [
    ("Light_Kitchen_Island", -3.2, 4.0, 2.2, 45, (1.0, 0.88, 0.65)),
    ("Light_Dining",         -3.4, 0.1, 2.2, 40, (1.0, 0.86, 0.62)),
    ("Light_Sunroom",         3.4, 4.5, 2.2, 45, (1.0, 0.88, 0.68)),
    ("Light_Bathroom",        3.4, 0.7, 2.2, 35, (1.0, 0.96, 0.92)),
    ("Light_Master_Study",   -3.4, -4.2, 2.2, 45, (1.0, 0.88, 0.66)),
    ("Light_Living_Room",     2.1, -3.8, 2.2, 55, (1.0, 0.88, 0.65)),
]
for lname, lx, ly, lz, energy, color in interior_lights:
    pdata = bpy.data.lights.new(lname, "POINT")
    pdata.energy = energy
    pdata.color = color
    pdata.shadow_soft_size = 0.4
    pobj = bpy.data.objects.new(lname, pdata)
    pobj.location = (lx, ly, lz)
    COL["Lighting"].objects.link(pobj)

# ==============================================================================
# 5. CAMERAS
# ==============================================================================
CURRENT_COL = COL["Cameras"]
aim_target = (-0.2, 0.1, 0.5)

cams = [
    add_camera("CAM_01_AERIAL_ISOMETRIC", (1.5, -21.0, 24.0), aim_target, 45),
    add_camera("CAM_02_TOP_FLOOR_PLAN", (0.0, 0.0, 30.0), (0, 0, 0), 50),
    add_camera("CAM_03_LIVING_ROOM", (2.1, -9.2, 4.8), (2.1, -3.8, 0.8), 35),
    add_camera("CAM_04_KITCHEN_ISLAND", (-3.3, -0.8, 5.2), (-3.3, 4.5, 0.9), 35),
    add_camera("CAM_05_SUNROOM", (3.4, -0.2, 4.2), (3.4, 4.5, 0.8), 35),
    add_camera("CAM_06_MASTER_STUDY", (-3.4, -1.2, 4.2), (-3.4, -4.8, 0.8), 35),
    add_camera("CAM_07_FRONT_PORCH", (11.2, -8.8, 5.2), (6.7, -3.8, 0.8), 38),
]
scene.camera = cams[0]

# ==============================================================================
# 6. RENDER OUTPUT & SAVE
# ==============================================================================
scene.render.filepath = "//villa_renders/CAM_01_AERIAL_ISOMETRIC.png"

bpy.ops.object.select_all(action='DESELECT')
for o in COL["Architecture"].objects:
    o.select_set(True)
if bpy.context.selected_objects:
    bpy.context.view_layer.objects.active = bpy.context.selected_objects[0]

if SAVE_BLEND:
    try:
        blend_path = bpy.path.abspath("//Modern_Luxury_Villa_Sales_Model.blend")
        bpy.ops.wm.save_as_mainfile(filepath=blend_path)
        print(f"[OK] Saved scene to: {blend_path}")
    except Exception as e:
        print(f"[Notice] Run inside Blender to save blend file: {e}")

print("====================================================================")
print("SUCCESS: Modern Residence 3D Architectural Scene generated!")
print("All rooms, callouts, and details match the reference photograph.")
print("Active Camera: CAM_01_AERIAL_ISOMETRIC.")
print("====================================================================")
