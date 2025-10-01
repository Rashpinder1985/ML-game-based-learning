-- Initialize the ML Learning database without using Docker
SELECT 'CREATE DATABASE ml_learning'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ml_learning')\gexec

\c ml_learning;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Reset auth-related tables to ensure schema matches application expectations
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'beginner',
    module VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    status VARCHAR(50) DEFAULT 'pending',
    result JSONB,
    job_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started',
    score INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    best_submission_id INTEGER REFERENCES submissions(id) ON DELETE SET NULL,
    progress_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

 TRUNCATE TABLE progress RESTART IDENTITY CASCADE;
 TRUNCATE TABLE submissions RESTART IDENTITY CASCADE;
TRUNCATE TABLE lessons RESTART IDENTITY CASCADE;

INSERT INTO lessons (title, description, content, difficulty, module) VALUES
    (
        'The Journey Begins: Twin Towns',
        $$🗺️ Plot your path between distant towns and discover the power of distance$$,
        $$# Challenge 1: The Journey Begins
# You are an adventurer standing at the crossroads between two mysterious towns.

import matplotlib.pyplot as plt
import numpy as np

print("🏰 Welcome to the Realm of Numbers, brave adventurer!")
print("=" * 55)
print()
print("📖 LEGEND SPEAKS:")
print("Two ancient towns lie hidden in this mathematical realm.")
print("Your quest begins by finding the shortest path between them.")
print()

# The two towns
town_mystral = (2, 5)  # Town of Mystral
town_zenith = (8, 1)   # Town of Zenith

print(f"🏰 Town of Mystral: {town_mystral}")
print(f"🏰 Town of Zenith: {town_zenith}")
print()

# Plot the towns
plt.figure(figsize=(10, 8))
plt.plot([town_mystral[0]], [town_mystral[1]], 'bo', markersize=15, label='🏰 Mystral')
plt.plot([town_zenith[0]], [town_zenith[1]], 'ro', markersize=15, label='🏰 Zenith')

# Draw a path
plt.plot([town_mystral[0], town_zenith[0]], [town_mystral[1], town_zenith[1]],
         'g--', linewidth=2, alpha=0.7, label='Your Path')

plt.grid(True, alpha=0.3)
plt.xlabel('East ↔ West')
plt.ylabel('North ↔ South')
plt.title('🗺️ The Twin Towns of Numbers')
plt.legend(fontsize=12)
plt.axis('equal')

# Add some magical elements
x_range = np.linspace(-1, 10, 100)
y_range = 3 + 0.5 * np.sin(2 * x_range)  # Mystical river
plt.plot(x_range, y_range, 'c-', alpha=0.4, linewidth=3, label='🌊 River of Equations')
plt.legend()

plt.show()

print("⚔️ CHALLENGE:")
print("Without using any distance formulas, estimate how far apart these towns are.")
print("Look at the grid squares and count your way there!")
print()
print("🎯 HINT: Think like you're walking on city blocks...")
print("How many steps East? How many steps South?")
print()

# TODO: Student estimates the distance
print("🎮 YOUR TURN:")
print("estimated_distance = ?  # Your estimate here")
print()
print("💫 REWARD AWAITS: Solve this to unlock the Vector Duel!")$$,
        'beginner',
        '⚔️ Mathematical Quests'
    ),
    (
        'Vector Duel: Angle of Warriors',
        $$⚔️ Face off against vector warriors and master the angle between forces$$,
        $$# Challenge 2: Vector Duel
# Two magical warriors challenge you to a duel of angles!

import numpy as np
import matplotlib.pyplot as plt

print("⚔️ THE VECTOR DUEL ARENA")
print("=" * 30)
print()
print("📖 A mystical voice echoes through the arena:")
print('"Two warriors of great power stand before you..."')
print('"Warrior Crimson wields the force vector u = <3, -2>"')
print('"Warrior Azure commands the vector v = <-1, 5>"')
print('"Find the angle between their powers to proceed!"')
print()

# The warrior vectors
warrior_crimson = np.array([3, -2])  # u vector
warrior_azure = np.array([-1, 5])    # v vector

# Visualize the vector duel
plt.figure(figsize=(10, 8))

# Draw vectors from origin
plt.quiver(0, 0, warrior_crimson[0], warrior_crimson[1],
           angles='xy', scale_units='xy', scale=1, color='crimson',
           width=0.008, label='⚔️ Crimson u=<3,-2>')

plt.quiver(0, 0, warrior_azure[0], warrior_azure[1],
           angles='xy', scale_units='xy', scale=1, color='blue',
           width=0.008, label='🛡️ Azure v=<-1,5>')

# Draw angle arc
theta_range = np.linspace(0, 2*np.pi, 100)
arc_x = 0.8 * np.cos(theta_range)
arc_y = 0.8 * np.sin(theta_range)
plt.plot(arc_x[:30], arc_y[:30], 'gold', linewidth=3, label='🌟 Angle θ')

plt.grid(True, alpha=0.3)
plt.axis('equal')
plt.xlim(-2, 4)
plt.ylim(-3, 6)
plt.xlabel('Realm X-Axis')
plt.ylabel('Realm Y-Axis')
plt.title('⚔️ The Great Vector Duel')
plt.legend()

# Add mystical effects
circle_x = np.cos(theta_range) * 2.5
circle_y = np.sin(theta_range) * 2.5
plt.plot(circle_x, circle_y, 'purple', alpha=0.2, linewidth=1, linestyle='--')

plt.show()

print("🧙 MATHEMATICAL MAGIC:")
print("To find the angle between warriors, use the ancient formula:")
print()
print("cos(θ = (u · v) / (|u| × |v|)")
print()
print("Where:")
print("• u · v is the dot product (inner alliance)")
print("• |u| and |v| are the magnitudes (warrior strengths)")
print()

# Calculate components step by step
dot_product = np.dot(warrior_crimson, warrior_azure)
magnitude_u = np.linalg.norm(warrior_crimson)
magnitude_v = np.linalg.norm(warrior_azure)

print(f"🔢 CALCULATIONS:")
print(f"Dot product u·v = {warrior_crimson[0]}×{warrior_azure[0]} + {warrior_crimson[1]}×{warrior_azure[1]} = {dot_product}")
print(f"Magnitude |u| = √({warrior_crimson[0]}² + {warrior_crimson[1]}²) = {magnitude_u:.3f}")
print(f"Magnitude |v| = √({warrior_azure[0]}² + {warrior_azure[1]}²) = {magnitude_v:.3f}")
print()

cos_theta = dot_product / (magnitude_u * magnitude_v)
print(f"cos(θ) = {dot_product} / ({magnitude_u:.3f} × {magnitude_v:.3f}) = {cos_theta:.3f}")

# TODO: Student calculates the angle
print("⚔️ YOUR CHALLENGE:")
print("theta_radians = np.arccos(cos_theta)")
print("theta_degrees = ?  # Convert to degrees")
print()
print("🎯 HINT: Use np.degrees() to convert from radians!")
print()
print("💰 Victory Reward: 50 XP + Vector Mastery Badge")
print("🚪 UNLOCK: The Magic Bridge of Bisectors!")$$,
        'beginner',
        '⚔️ Mathematical Quests'
    ),
    (
        'The Magic Bridge: Perpendicular Bisector',
        $$🌉 Build the mystical bridge that perfectly balances two sacred stones$$,
        $$# Challenge 3: The Magic Bridge
# Ancient stones block your path - only the perfect bridge can unite them!

import numpy as np
import matplotlib.pyplot as plt

print("🌉 THE BRIDGE OF ETERNAL BALANCE")
print("=" * 35)
print()
print("📖 The Ancient Prophecy:")
print('"Two Sacred Stones of Power rest in the realm..."')
print('"Stone of Light at coordinates (0, 6)"')
print('"Stone of Shadow at coordinates (6, 0)"')
print('"Only the Bridge of Perfect Balance can unite their power."')
print('"This bridge must be equidistant from both stones..."')
print()

# The sacred stones
stone_light = np.array([0, 6])
stone_shadow = np.array([6, 0])

print(f"💎 Stone of Light: {stone_light}")
print(f"🖤 Stone of Shadow: {stone_shadow}")
print()

# Visualize the mystical realm
plt.figure(figsize=(12, 10))

# Draw the stones
plt.plot(stone_light[0], stone_light[1], 'yo', markersize=20, label='💎 Stone of Light', markeredgecolor='gold', markeredgewidth=3)
plt.plot(stone_shadow[0], stone_shadow[1], 'ko', markersize=20, label='🖤 Stone of Shadow', markeredgecolor='purple', markeredgewidth=3)

# Draw line connecting the stones
plt.plot([stone_light[0], stone_shadow[0]], [stone_light[1], stone_shadow[1]],
         'r--', linewidth=2, alpha=0.6, label='🔗 Connection of Stones')

# Find midpoint (center of the bridge)
midpoint = (stone_light + stone_shadow) / 2
plt.plot(midpoint[0], midpoint[1], 'g*', markersize=15, label='⭐ Bridge Center')

print(f"🎯 STEP 1: Find the midpoint between stones")
print(f"Midpoint = ({stone_light} + {stone_shadow}) / 2")
print(f"Midpoint = ({midpoint[0]}, {midpoint[1]})")
print()

# Calculate slope of connecting line
slope_stones = (stone_shadow[1] - stone_light[1]) / (stone_shadow[0] - stone_light[0])
print(f"🎯 STEP 2: Find slope of stone connection")
print(f"slope = (y₂ - y₁) / (x₂ - x₁) = ({stone_shadow[1]} - {stone_light[1]}) / ({stone_shadow[0]} - {stone_light[0]}) = {slope_stones}")

# Perpendicular slope
perpendicular_slope = -1 / slope_stones
print(f"🎯 STEP 3: Perpendicular slope = -1/slope = {perpendicular_slope}")
print()

# Draw the magic bridge (perpendicular bisector)
x_bridge = np.linspace(-2, 8, 100)
y_bridge = perpendicular_slope * (x_bridge - midpoint[0]) + midpoint[1]

plt.plot(x_bridge, y_bridge, 'b-', linewidth=4, alpha=0.8, label='🌉 Magic Bridge')

# Add mystical grid
plt.grid(True, alpha=0.3)
plt.xlabel('East ↔ West')
plt.ylabel('North ↔ South')
plt.title('🌉 The Bridge of Eternal Balance')
plt.axis('equal')
plt.legend(fontsize=11)

# Add magical effects
theta = np.linspace(0, 2*np.pi, 50)
for radius in [1, 2]:
    magic_x = midpoint[0] + radius * np.cos(theta)
    magic_y = midpoint[1] + radius * np.sin(theta)
    plt.plot(magic_x, magic_y, 'cyan', alpha=0.3, linestyle=':', linewidth=1)

plt.xlim(-1, 7)
plt.ylim(-1, 7)
plt.show()

print("🧙‍♂️ BRIDGE EQUATION:")
print(f"The Magic Bridge follows: y - {midpoint[1]} = {perpendicular_slope}(x - {midpoint[0]})")
print(f"Simplified: y = {perpendicular_slope}x + {midpoint[1] - perpendicular_slope * midpoint[0]}")
print()

print("⚔️ CHALLENGE COMPLETE!")
print("🏆 REWARDS:")
print("• 75 XP")
print("• Bridge Builder Badge")
print("• Geometric Wisdom +1")
print()
print("✨ MAGICAL INSIGHT:")
print("You've discovered the perpendicular bisector - a line that will become")
print("the foundation of decision boundaries in machine learning!")
print()
print("🚪 NEXT QUEST: Roads & Waypoints - The Linear Paths Await!")$$,
        'beginner',
        '⚔️ Mathematical Quests'
    ),
    (
        'Roads & Waypoints: Linear Paths',
        $$🛣️ Navigate the mystical roads and discover where paths cross the realm$$,
        $$# Challenge 4: Roads & Waypoints
# Ancient roads crisscross the realm - master their secrets!

import numpy as np
import matplotlib.pyplot as plt

print("🛣️ THE ROADS OF LINEAR DESTINY")
print("=" * 33)
print()
print("📖 The Road Master's Challenge:")
print('"Two great roads traverse our realm..."')
print('"The Royal Road: y = 3x"')
print('"The Merchant\'s Path: y = 2x + 3"')
print('"Find where these roads meet the realm\'s borders!"')
print()

# Define the roads
x_range = np.linspace(-5, 5, 100)
royal_road = 3 * x_range        # y = 3x
merchants_path = 2 * x_range + 3  # y = 2x + 3

# Create the mystical map
plt.figure(figsize=(12, 10))

# Draw the roads
plt.plot(x_range, royal_road, 'gold', linewidth=4, label='👑 Royal Road: y = 3x')
plt.plot(x_range, merchants_path, 'brown', linewidth=4, label='🏪 Merchant\'s Path: y = 2x + 3')

# Mark special waypoints
print("🎯 WAYPOINT DISCOVERY:")
print()

# Y-intercepts (where roads cross the North-South border)
royal_y_intercept = 0  # When x = 0, y = 3(0) = 0
merchant_y_intercept = 3  # When x = 0, y = 2(0) + 3 = 3

plt.plot(0, royal_y_intercept, 'go', markersize=12, label='🌟 Royal Y-Intercept')
plt.plot(0, merchant_y_intercept, 'ro', markersize=12, label='🌟 Merchant Y-Intercept')

print(f"👑 Royal Road crosses North-South border at: (0, {royal_y_intercept})")
print(f"🏪 Merchant's Path crosses North-South border at: (0, {merchant_y_intercept})")
print()

# X-intercepts (where roads cross the East-West border)
# Royal Road: 0 = 3x → x = 0
royal_x_intercept = 0

# Merchant's Path: 0 = 2x + 3 → x = -3/2
merchant_x_intercept = -3/2

plt.plot(royal_x_intercept, 0, 'g^', markersize=12, label='🌟 Royal X-Intercept')
plt.plot(merchant_x_intercept, 0, 'r^', markersize=12, label='🌟 Merchant X-Intercept')

print(f"👑 Royal Road crosses East-West border at: ({royal_x_intercept}, 0)")
print(f"🏪 Merchant's Path crosses East-West border at: ({merchant_x_intercept}, 0)")
print()

# Find intersection of the two roads
# 3x = 2x + 3
# x = 3
intersection_x = 3
intersection_y = 3 * intersection_x
plt.plot(intersection_x, intersection_y, 'purple', marker='*', markersize=20,
         label='⭐ Great Crossroads')

print(f"🏛️ THE GREAT CROSSROADS:")
print(f"Roads intersect at: ({intersection_x}, {intersection_y})")
print("This is where 3x = 2x + 3, so x = 3 and y = 9")
print()

# Add realm boundaries
plt.axhline(y=0, color='black', linewidth=2, alpha=0.7, label='🌍 East-West Border')
plt.axvline(x=0, color='black', linewidth=2, alpha=0.7, label='🌍 North-South Border')

# Beautify the map
plt.grid(True, alpha=0.3)
plt.xlabel('East ↔ West')
plt.ylabel('North ↔ South')
plt.title('🛣️ The Roads of Linear Destiny')
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.xlim(-5, 5)
plt.ylim(-5, 15)

# Add mystical elements
theta = np.linspace(0, 2*np.pi, 100)
for i, radius in enumerate([0.5, 1, 1.5]):
    circle_x = intersection_x + radius * np.cos(theta)
    circle_y = intersection_y + radius * np.sin(theta)
    plt.plot(circle_x, circle_y, 'purple', alpha=0.3-i*0.1, linestyle='--', linewidth=1)

plt.tight_layout()
plt.show()

print("⚔️ MASTERY CHALLENGES:")
print("1. Where does Royal Road cross y = 6? (Hint: 6 = 3x)")
print("2. Where does Merchant's Path have x-coordinate = 2?")
print("3. Which road is steeper? How do you know?")
print()

print("🎓 MATHEMATICAL WISDOM:")
print("• Slope tells you the steepness of the road")
print("• Y-intercept is where the road starts at x=0")
print("• X-intercept is where the road crosses the x-axis")
print("• These concepts become decision boundaries in ML!")
print()

print("🏆 QUEST REWARDS:")
print("• 100 XP")
print("• Pathfinder Badge")
print("• Linear Intuition +2")
print()
print("🚪 NEXT ADVENTURE: Valley of Curves - Where Quadratics Rule!")$$,
        'beginner',
        '⚔️ Mathematical Quests'
    ),
    (
        'Valley of Curves: The Quadratic Quest',
        $$🏔️ Venture into the Valley of Curves and find the magical vertex of power$$,
        $$# Challenge 5: Valley of Curves
# A mystical parabola guards the valley - find its secrets!

import numpy as np
import matplotlib.pyplot as plt

print("🏔️ THE VALLEY OF QUADRATIC MYSTERIES")
print("=" * 38)
print()
print("📖 The Valley Guardian speaks:")
print('"A magical curve protects this valley..."')
print('"Its equation: f(x) = x² - 4x + 3"')
print('"Find the vertex of power, the roots of entry,"')
print('"and the axis of symmetry to proceed!"')
print()

# Define the mystical quadratic
def mystical_curve(x):
    return x**2 - 4*x + 3

# Create detailed view of the valley
x_valley = np.linspace(-1, 5, 1000)
y_valley = mystical_curve(x_valley)

plt.figure(figsize=(12, 10))

# Draw the mystical curve
plt.plot(x_valley, y_valley, 'darkgreen', linewidth=4, label='🐉 Guardian Curve: f(x) = x² - 4x + 3')

print("🎯 QUEST 1: Find the Vertex of Power")
print("For f(x) = ax² + bx + c, vertex x-coordinate = -b/(2a)")
print()

# Find vertex
a, b, c = 1, -4, 3
vertex_x = -b / (2 * a)
vertex_y = mystical_curve(vertex_x)

print(f"📐 CALCULATION:")
print(f"a = {a}, b = {b}, c = {c}")
print(f"Vertex x = -({b})/(2×{a}) = {vertex_x}")
print(f"Vertex y = f({vertex_x}) = {vertex_x}² - 4×{vertex_x} + 3 = {vertex_y}")
print(f"🏛️ VERTEX OF POWER: ({vertex_x}, {vertex_y})")
print()

# Mark the vertex
plt.plot(vertex_x, vertex_y, 'red', marker='*', markersize=20, label='⭐ Vertex of Power')

print("🎯 QUEST 2: Find the Roots of Entry")
print("Solve: x² - 4x + 3 = 0")
print("Using factoring: (x - 1)(x - 3) = 0")
print()

# Find roots
roots = [1, 3]  # From factoring (x-1)(x-3) = 0
for root in roots:
    plt.plot(root, 0, 'blue', marker='o', markersize=15, markeredgewidth=3, markeredgecolor='gold')

print(f"🚪 ROOT 1: x = {roots[0]} (First Gate of Entry)")
print(f"🚪 ROOT 2: x = {roots[1]} (Second Gate of Entry)")
print("✅ Verification: f(1) = 1 - 4 + 3 = 0 ✓")
print("✅ Verification: f(3) = 9 - 12 + 3 = 0 ✓")
print()

print("🎯 QUEST 3: Find the Axis of Symmetry")
axis_x = vertex_x  # Same as vertex x-coordinate
plt.axvline(x=axis_x, color='purple', linestyle='--', linewidth=3, alpha=0.8, label='🔮 Axis of Symmetry')

print(f"🔮 AXIS OF SYMMETRY: x = {axis_x}")
print("This magical line divides the curve into perfect halves!")
print()

# Add grid and labels
plt.grid(True, alpha=0.3)
plt.xlabel('Realm X-Coordinate')
plt.ylabel('Mystical Y-Power')
plt.title('🏔️ The Valley of Quadratic Mysteries')
plt.legend()

# Mark special points
plt.axhline(y=0, color='black', linewidth=1, alpha=0.5)
plt.axvline(x=0, color='black', linewidth=1, alpha=0.5)

# Add mystical annotations
plt.annotate('⭐ Minimum Point\\n(Valley Floor)', xy=(vertex_x, vertex_y),
             xytext=(vertex_x-1, vertex_y+2), fontsize=10,
             arrowprops=dict(arrowstyle='->', color='red', lw=2))

plt.annotate('🚪 Entry Gate', xy=(1, 0), xytext=(1, -1.5), fontsize=10,
             arrowprops=dict(arrowstyle='->', color='blue', lw=1.5))

plt.annotate('🚪 Exit Gate', xy=(3, 0), xytext=(3, -1.5), fontsize=10,
             arrowprops=dict(arrowstyle='->', color='blue', lw=1.5))

plt.xlim(-1, 5)
plt.ylim(-2, 6)
plt.show()

print("🧙‍♂️ MATHEMATICAL MAGIC REVEALED:")
print()

print("📊 KEY PROPERTIES:")
print(f"• Vertex (turning point): ({vertex_x}, {vertex_y})")
print(f"• Roots (x-intercepts): {roots[0]} and {roots[1]}")
print(f"• Y-intercept: f(0) = {mystical_curve(0)}")
print(f"• Axis of symmetry: x = {axis_x}")
print(f"• Opens upward (a = {a} > 0)")
print()

print("⚔️ BONUS CHALLENGES:")
print("1. What is f(2)? (Hint: Use symmetry!)")
print("2. Find another point with the same y-value as f(0)")
print("3. What's the minimum value of this function?")
print()

print("🎓 DEEP WISDOM:")
print("This parabola shape appears everywhere in ML:")
print("• Cost functions in optimization")
print("• Error surfaces in neural networks")
print("• The vertex represents optimal solutions!")
print()

print("🏆 VALLEY CONQUERED!")
print("• 125 XP")
print("• Curve Master Badge")
print("• Optimization Intuition +3")
print()
print("🚪 NEXT EPIC: Duel of Lines - Where Roads Battle for Angles!")$$,
        'intermediate',
        '⚔️ Mathematical Quests'
    ),
    (
        'Duel of Lines: Angle Warriors',
        $$⚔️ Two mighty line warriors clash - calculate the angle between their battle stances$$,
        $$# Challenge 6: Duel of Lines
# Two line warriors meet in epic combat - find the angle between them!

import numpy as np
import matplotlib.pyplot as plt

print("⚔️ THE GREAT LINE DUEL")
print("=" * 25)
print()
print("📖 The Arena Master announces:")
print('"Behold! Two legendary line warriors enter the arena!"')
print('"Warrior Crimson: y = 2x + 3"')
print('"Warrior Azure: y = -3x + 2"')
print('"Find the angle between their battle stances!"')
print()

# Extract slopes
m1 = 2   # Slope of Crimson warrior
m2 = -3  # Slope of Azure warrior

print(f"⚔️ Warrior Crimson slope: m₁ = {m1}")
print(f"🛡️ Warrior Azure slope: m₂ = {m2}")
print()

# Visualize the battle
plt.figure(figsize=(12, 10))

x_range = np.linspace(-3, 3, 100)
line1 = m1 * x_range + 3  # y = 2x + 3
line2 = m2 * x_range + 2  # y = -3x + 2

plt.plot(x_range, line1, 'red', linewidth=4, label='⚔️ Crimson: y = 2x + 3')
plt.plot(x_range, line2, 'blue', linewidth=4, label='🛡️ Azure: y = -3x + 2')

# Find intersection point
# 2x + 3 = -3x + 2
# 5x = -1
# x = -1/5
x_intersect = -1/5
y_intersect = m1 * x_intersect + 3

plt.plot(x_intersect, y_intersect, 'gold', marker='*', markersize=20,
         label=f'⭐ Battle Point ({x_intersect:.2f}, {y_intersect:.2f})')

print(f"🏛️ BATTLE INTERSECTION:")
print(f"Lines meet at: ({x_intersect:.2f}, {y_intersect:.2f})")
print()

print("🧙‍♂️ ANGLE MAGIC FORMULA:")
print("For lines with slopes m₁ and m₂:")
print("tan(θ) = |(m₁ - m₂) / (1 + m₁m₂)|")
print()

# Calculate angle
numerator = abs(m1 - m2)
denominator = abs(1 + m1 * m2)
tan_theta = numerator / denominator

print(f"📐 CALCULATIONS:")
print(f"m₁ - m₂ = {m1} - ({m2}) = {m1 - m2}")
print(f"1 + m₁m₂ = 1 + ({m1})({m2}) = 1 + {m1 * m2} = {1 + m1 * m2}")
print(f"tan(θ) = |{m1 - m2}| / |{1 + m1 * m2}| = {numerator} / {denominator} = {tan_theta:.3f}")

angle_radians = np.arctan(tan_theta)
angle_degrees = np.degrees(angle_radians)

print(f"θ = arctan({tan_theta:.3f}) = {angle_degrees:.1f}°")
print()

# Add angle visualization
angle_arc_x = x_intersect + 0.3 * np.cos(np.linspace(0, angle_radians, 30))
angle_arc_y = y_intersect + 0.3 * np.sin(np.linspace(0, angle_radians, 30))
plt.plot(angle_arc_x, angle_arc_y, 'gold', linewidth=3, label=f'🌟 Battle Angle: {angle_degrees:.1f}°')

plt.grid(True, alpha=0.3)
plt.xlabel('Arena X-Axis')
plt.ylabel('Arena Y-Axis')
plt.title('⚔️ The Great Line Duel')
plt.legend()
plt.axis('equal')
plt.xlim(-2, 2)
plt.ylim(-2, 8)

# Add battle effects
theta_effect = np.linspace(0, 2*np.pi, 100)
for radius in [0.5, 1, 1.5]:
    effect_x = x_intersect + radius * np.cos(theta_effect)
    effect_y = y_intersect + radius * np.sin(theta_effect)
    plt.plot(effect_x, effect_y, 'purple', alpha=0.2, linestyle='--')

plt.show()

print("⚔️ WARRIOR ANALYSIS:")
print(f"• Crimson stance angle: {np.degrees(np.arctan(m1)):.1f}° from horizontal")
print(f"• Azure stance angle: {np.degrees(np.arctan(m2)):.1f}° from horizontal")
print(f"• Battle angle between warriors: {angle_degrees:.1f}°")
print()

print("🎓 STRATEGIC WISDOM:")
print("When slopes have opposite signs, warriors cross at acute angles!")
print("When both positive or both negative, they battle at obtuse angles!")
print("This becomes crucial for ML decision boundary analysis!")
print()

print("🏆 DUEL VICTORY REWARDS:")
print("• 150 XP")
print("• Angle Master Badge")
print("• Geometric Battle Sense +4")
print()
print("🚪 NEXT CHALLENGE: Tower Watch - The Angle of Depression!")$$,
        'intermediate',
        '⚔️ Mathematical Quests'
    ),
    (
        'Tower Watch: Angle of Depression',
        $$🏰 Stand atop the ancient watchtower and master the angle of sight$$,
        $$# Challenge 7: Tower Watch
# From the ancient watchtower, calculate the angle of depression to distant targets!

import numpy as np
import matplotlib.pyplot as plt

print("🏰 THE WATCHTOWER OF ANGLES")
print("=" * 30)
print()
print("📖 The Tower Guardian's Challenge:")
print('"Brave adventurer, you stand atop our ancient watchtower..."')
print('"Height: 30 meters above the realm"')
print('"A mysterious object lies 50 meters away on the ground"')
print('"What angle must you look down to see it?"')
print()

# Tower specifications
tower_height = 30  # meters
horizontal_distance = 50  # meters

print(f"🏗️ TOWER SPECIFICATIONS:")
print(f"Height: {tower_height} meters")
print(f"Distance to target: {horizontal_distance} meters")
print()

# Create the mystical scene
plt.figure(figsize=(12, 8))

# Draw the tower
plt.plot([0, 0], [0, tower_height], 'brown', linewidth=8, label='🏰 Watchtower')
plt.plot([-2, 2], [tower_height, tower_height], 'gray', linewidth=4, label='🔭 Observation Deck')

# Draw the ground
ground_x = np.linspace(-10, 60, 100)
ground_y = np.zeros_like(ground_x)
plt.plot(ground_x, ground_y, 'green', linewidth=3, label='🌱 Ground Level')

# Mark the target
plt.plot(horizontal_distance, 0, 'red', marker='o', markersize=15,
         label='🎯 Mysterious Target')

# Draw line of sight
plt.plot([0, horizontal_distance], [tower_height, 0], 'gold', linewidth=3,
         linestyle='--', label='👁️ Line of Sight')

# Draw horizontal reference line
plt.plot([0, horizontal_distance], [tower_height, tower_height], 'blue',
         linewidth=2, linestyle=':', alpha=0.7, label='🧭 Horizontal Reference')

print("🎯 ANGLE OF DEPRESSION CALCULATION:")
print("This is a right triangle problem!")
print()

# Calculate angle using trigonometry
opposite_side = tower_height  # Vertical drop
adjacent_side = horizontal_distance  # Horizontal distance

tan_angle = opposite_side / adjacent_side
angle_radians = np.arctan(tan_angle)
angle_degrees = np.degrees(angle_radians)

print(f"📐 RIGHT TRIANGLE ANALYSIS:")
print(f"Opposite side (height) = {opposite_side} m")
print(f"Adjacent side (distance) = {adjacent_side} m")
print(f"Hypotenuse = √({opposite_side}² + {adjacent_side}²) = {np.sqrt(opposite_side**2 + adjacent_side**2):.1f} m")
print()

print(f"🧮 TRIGONOMETRY:")
print(f"tan(θ) = opposite/adjacent = {opposite_side}/{adjacent_side} = {tan_angle:.3f}")
print(f"θ = arctan({tan_angle:.3f}) = {angle_degrees:.1f}°")
print()

# Mark the angle
angle_arc_range = np.linspace(-angle_radians, 0, 30)
arc_radius = 8
arc_x = arc_radius * np.cos(angle_arc_range)
arc_y = tower_height + arc_radius * np.sin(angle_arc_range)
plt.plot(arc_x, arc_y, 'gold', linewidth=4, label=f'📐 Depression Angle: {angle_degrees:.1f}°')

# Add annotations
plt.annotate(f'{tower_height}m', xy=(-3, tower_height/2), fontsize=12,
             ha='center', va='center', bbox=dict(boxstyle="round,pad=0.3", facecolor="yellow"))

plt.annotate(f'{horizontal_distance}m', xy=(horizontal_distance/2, -3), fontsize=12,
             ha='center', va='center', bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue"))

plt.annotate(f'θ = {angle_degrees:.1f}°', xy=(5, tower_height-5), fontsize=14,
             ha='center', va='center', bbox=dict(boxstyle="round,pad=0.5", facecolor="gold"))

plt.grid(True, alpha=0.3)
plt.xlabel('Distance (meters)')
plt.ylabel('Height (meters)')
plt.title('🏰 The Watchtower of Angles')
plt.legend()
plt.axis('equal')
plt.xlim(-10, 60)
plt.ylim(-5, 40)

# Add mystical effects around the tower
theta_effect = np.linspace(0, 2*np.pi, 50)
for radius in [3, 6]:
    effect_x = radius * np.cos(theta_effect)
    effect_y = tower_height + radius * np.sin(theta_effect)
    plt.plot(effect_x, effect_y, 'cyan', alpha=0.3, linestyle=':', linewidth=1)

plt.show()

print("🔍 ADDITIONAL CALCULATIONS:")

# Distance using Pythagorean theorem
hypotenuse = np.sqrt(opposite_side**2 + adjacent_side**2)
print(f"Direct distance to target: {hypotenuse:.1f} m")

# Other trigonometric ratios
sin_angle = opposite_side / hypotenuse
cos_angle = adjacent_side / hypotenuse

print(f"sin(θ) = {opposite_side}/{hypotenuse:.1f} = {sin_angle:.3f}")
print(f"cos(θ) = {adjacent_side}/{hypotenuse:.1f} = {cos_angle:.3f}")
print()

print("⚔️ MASTERY CHALLENGES:")
print("1. If the tower was 40m high, what would the angle be?")
print("2. At what distance would the angle of depression be 45°?")
print("3. What if you're looking up from the ground? (Angle of elevation)")
print()

print("🎓 REAL-WORLD CONNECTIONS:")
print("• Navigation and surveying")
print("• Computer vision and robotics")
print("• Machine learning: gradient descent slopes!")
print("• Neural networks: activation function angles")
print()

print("🏆 TOWER MASTERY REWARDS:")
print("• 175 XP")
print("• Trigonometry Scout Badge")
print("• Angle Intuition +5")
print()
print("🚪 NEXT QUEST: Triangle Forge - Where Sacred Shapes Are Born!")$$,
        'intermediate',
        '⚔️ Mathematical Quests'
    ),
    (
        'Triangle Forge: Sacred Geometry',
        $$🔥 In the mystical forge, craft the perfect triangle and find its center of balance$$,
        $$# Challenge 8: Triangle Forge
# The ancient forge awaits - create the sacred 3-4-5 triangle and find its centroid!

import numpy as np
import matplotlib.pyplot as plt

print("🔥 THE MYSTICAL TRIANGLE FORGE")
print("=" * 32)
print()
print("📖 The Forge Master speaks:")
print('"Welcome to the Triangle Forge, sacred crafter of geometry!"')
print('"Forge the legendary 3-4-5 triangle of power..."')
print('"Vertices at: Origin (0,0), Point Alpha (3,0), Point Beta (0,4)"')
print('"Find its hypotenuse and the mystical centroid!"')
print()

# Define the sacred triangle vertices
origin = np.array([0, 0])
point_alpha = np.array([3, 0])
point_beta = np.array([0, 4])

print(f"🔺 SACRED TRIANGLE VERTICES:")
print(f"Origin (O): {origin}")
print(f"Point Alpha (A): {point_alpha}")
print(f"Point Beta (B): {point_beta}")
print()

# Create the mystical forge visualization
plt.figure(figsize=(12, 10))

# Draw the triangle
triangle_x = [origin[0], point_alpha[0], point_beta[0], origin[0]]
triangle_y = [origin[1], point_alpha[1], point_beta[1], origin[1]]
plt.plot(triangle_x, triangle_y, 'red', linewidth=4, label='🔺 Sacred 3-4-5 Triangle')

# Mark vertices with magical symbols
plt.plot(origin[0], origin[1], 'ko', markersize=15, label='⭐ Origin (0,0)')
plt.plot(point_alpha[0], point_alpha[1], 'bo', markersize=15, label='🔵 Alpha (3,0)')
plt.plot(point_beta[0], point_beta[1], 'go', markersize=15, label='🟢 Beta (0,4)')

print("🎯 QUEST 1: Calculate the Hypotenuse")
print("Using the Pythagorean Theorem: c² = a² + b²")
print()

# Calculate side lengths
side_a = np.linalg.norm(point_alpha - origin)  # Base: 3 units
side_b = np.linalg.norm(point_beta - origin)   # Height: 4 units
hypotenuse = np.linalg.norm(point_beta - point_alpha)  # Hypotenuse

print(f"📐 SIDE CALCULATIONS:")
print(f"Base (a) = distance from Origin to Alpha = {side_a} units")
print(f"Height (b) = distance from Origin to Beta = {side_b} units")
print(f"Hypotenuse (c) = √(a² + b²) = √({side_a}² + {side_b}²) = √{side_a**2 + side_b**2} = {hypotenuse} units")
print()

# Verify this is indeed a 3-4-5 right triangle
print(f"✅ VERIFICATION: This IS the famous 3-4-5 right triangle!")
print(f"✅ Right angle at Origin: 3² + 4² = {3**2} + {4**2} = {3**2 + 4**2} = 5² = {5**2}")
print()

print("🎯 QUEST 2: Find the Mystical Centroid")
print("The centroid is the balance point - average of all vertices!")
print()

# Calculate centroid
centroid = (origin + point_alpha + point_beta) / 3
centroid_x = (origin[0] + point_alpha[0] + point_beta[0]) / 3
centroid_y = (origin[1] + point_alpha[1] + point_beta[1]) / 3

print(f"🧮 CENTROID CALCULATION:")
print(f"Centroid_x = (x₁ + x₂ + x₃) / 3 = ({origin[0]} + {point_alpha[0]} + {point_beta[0]}) / 3 = {centroid_x:.2f}")
print(f"Centroid_y = (y₁ + y₂ + y₃) / 3 = ({origin[1]} + {point_alpha[1]} + {point_beta[1]}) / 3 = {centroid_y:.2f}")
print(f"🏛️ MYSTICAL CENTROID: ({centroid_x:.2f}, {centroid_y:.2f})")
print()

# Mark the centroid
plt.plot(centroid[0], centroid[1], 'gold', marker='*', markersize=20,
         label=f'⭐ Centroid ({centroid_x:.2f}, {centroid_y:.2f})')

# Draw medians (lines from vertices to midpoints of opposite sides)
midpoint_ab = (origin + point_alpha) / 2
midpoint_bc = (point_alpha + point_beta) / 2
midpoint_ac = (origin + point_beta) / 2

plt.plot([point_beta[0], midpoint_ab[0]], [point_beta[1], midpoint_ab[1]],
         'purple', linewidth=2, linestyle='--', alpha=0.7, label='🔮 Medians')
plt.plot([origin[0], midpoint_bc[0]], [origin[1], midpoint_bc[1]],
         'purple', linewidth=2, linestyle='--', alpha=0.7)
plt.plot([point_alpha[0], midpoint_ac[0]], [point_alpha[1], midpoint_ac[1]],
         'purple', linewidth=2, linestyle='--', alpha=0.7)

# Add measurements
plt.annotate(f'a = {side_a}', xy=(1.5, -0.3), fontsize=12, ha='center',
             bbox=dict(boxstyle="round,pad=0.2", facecolor="lightblue"))
plt.annotate(f'b = {side_b}', xy=(-0.3, 2), fontsize=12, ha='center', rotation=90,
             bbox=dict(boxstyle="round,pad=0.2", facecolor="lightgreen"))
plt.annotate(f'c = {hypotenuse}', xy=(1.5, 2.2), fontsize=12, ha='center', rotation=-53,
             bbox=dict(boxstyle="round,pad=0.2", facecolor="lightcoral"))

# Right angle marker
right_angle_size = 0.3
plt.plot([0, right_angle_size, right_angle_size, 0],
         [0, 0, right_angle_size, right_angle_size], 'black', linewidth=2)

plt.grid(True, alpha=0.3)
plt.xlabel('Forge X-Coordinate')
plt.ylabel('Forge Y-Coordinate')
plt.title('🔥 The Mystical Triangle Forge')
plt.legend()
plt.axis('equal')
plt.xlim(-1, 4)
plt.ylim(-1, 5)

# Add mystical forge effects
theta_effect = np.linspace(0, 2*np.pi, 100)
for i, radius in enumerate([0.2, 0.4, 0.6]):
    effect_x = centroid[0] + radius * np.cos(theta_effect)
    effect_y = centroid[1] + radius * np.sin(theta_effect)
    plt.plot(effect_x, effect_y, 'gold', alpha=0.5-i*0.15, linewidth=2)

plt.show()

print("🧙‍♂️ GEOMETRIC MAGIC REVEALED:")
print()

# Calculate area using multiple methods
area_base_height = 0.5 * side_a * side_b
print(f"📊 TRIANGLE PROPERTIES:")
print(f"• Area = ½ × base × height = ½ × {side_a} × {side_b} = {area_base_height} square units")
print(f"• Perimeter = {side_a} + {side_b} + {hypotenuse} = {side_a + side_b + hypotenuse} units")
print(f"• Type: Right triangle (90° angle at origin)")
print(f"• Special property: 3-4-5 Pythagorean triple!")
print()

# Angle calculations
angle_at_alpha = np.degrees(np.arctan(side_b / side_a))
angle_at_beta = np.degrees(np.arctan(side_a / side_b))

print(f"📐 INTERIOR ANGLES:")
print(f"• Angle at Origin: 90°")
print(f"• Angle at Alpha: {angle_at_alpha:.1f}°")
print(f"• Angle at Beta: {angle_at_beta:.1f}°")
print(f"• Sum: 90° + {angle_at_alpha:.1f}° + {angle_at_beta:.1f}° = 180° ✓")
print()

print("⚔️ MASTERY CHALLENGES:")
print("1. If you scale this triangle by factor 2, what's the new area?")
print("2. Where would the centroid be for triangle with vertices (1,1), (4,1), (2,5)?")
print("3. Find the circumcenter (center of circle passing through all vertices)")
print()

print("🎓 DEEP WISDOM FOR ML:")
print("• Centroids become cluster centers in unsupervised learning")
print("• Right triangles appear in distance calculations")
print("• Triangle inequality crucial for metric spaces")
print("• Area calculations lead to statistical measures")
print()

print("🏆 FORGE MASTERY REWARDS:")
print("• 200 XP")
print("• Sacred Geometry Badge")
print("• Spatial Reasoning +6")
print()
print("🚪 NEXT MYSTICAL JOURNEY: Circle Rune - The Parametric Portal!")$$,
        'intermediate',
        '⚔️ Mathematical Quests'
    ),
    (
        'Circle Rune: The Parametric Portal',
        $$⭕ Trace the mystical unit circle and unlock the secrets of parametric motion$$,
        $$# Challenge 9: Circle Rune
# Trace the ancient unit circle using parametric magic - the foundation of all cycles!

import numpy as np
import matplotlib.pyplot as plt

print("⭕ THE CIRCLE RUNE OF INFINITE MOTION")
print("=" * 38)
print()
print("📖 The Circle Sage whispers:")
print('"Behold the most perfect of all shapes..."')
print('"The Unit Circle of radius 1, centered at the origin"')
print('"Trace its path using the parametric incantation:"')
print('"x = cos(t), y = sin(t) where t is the angle parameter"')
print()

# Create the parametric unit circle
t_values = np.linspace(0, 2*np.pi, 1000)
x_circle = np.cos(t_values)
y_circle = np.sin(t_values)

print(f"🎯 PARAMETRIC EQUATIONS:")
print(f"x(t) = cos(t)")
print(f"y(t) = sin(t)")
print(f"where t ranges from 0 to 2π radians")
print()

# Create the mystical visualization
plt.figure(figsize=(12, 12))

# Draw the complete circle
plt.plot(x_circle, y_circle, 'blue', linewidth=4, label='⭕ Unit Circle: x² + y² = 1')

# Mark special points on the circle
special_angles = [0, np.pi/2, np.pi, 3*np.pi/2]
special_names = ['East (0°)', 'North (90°)', 'West (180°)', 'South (270°)']
special_coords = [(1,0), (0,1), (-1,0), (0,-1)]

for i, (angle, name, coord) in enumerate(zip(special_angles, special_names, special_coords)):
    x_point = np.cos(angle)
    y_point = np.sin(angle)

    colors = ['red', 'green', 'orange', 'purple']
    plt.plot(x_point, y_point, colors[i], marker='o', markersize=15,
             label=f'{name}: ({x_point:.0f}, {y_point:.0f})')

    # Draw radius line
    plt.plot([0, x_point], [0, y_point], colors[i], linewidth=2, alpha=0.6)

print(f"🌟 CARDINAL POINTS OF POWER:")
for i, (angle, name, coord) in enumerate(zip(special_angles, special_names, special_coords)):
    angle_degrees = np.degrees(angle)
    print(f"• {name}: t = {angle:.3f} rad ({angle_degrees:.0f}°) → ({coord[0]}, {coord[1]})")
print()

# Show animation-like points at different t values
animation_t = [np.pi/6, np.pi/4, np.pi/3, 2*np.pi/3, 3*np.pi/4, 5*np.pi/6]
for i, t in enumerate(animation_t):
    x_t = np.cos(t)
    y_t = np.sin(t)
    plt.plot(x_t, y_t, 'gold', marker='*', markersize=10, alpha=0.7)

    if i < 3:  # Only label a few to avoid clutter
        plt.annotate(f't={t:.2f}', xy=(x_t, y_t), xytext=(x_t+0.15, y_t+0.1),
                    fontsize=9, alpha=0.8)

# Center point
plt.plot(0, 0, 'black', marker='+', markersize=15, markeredgewidth=3, label='⊕ Center (0,0)')

# Coordinate axes
plt.axhline(y=0, color='black', linewidth=1, alpha=0.3)
plt.axvline(x=0, color='black', linewidth=1, alpha=0.3)

# Grid
plt.grid(True, alpha=0.3)
plt.xlabel('X-Coordinate (Cosine Values)')
plt.ylabel('Y-Coordinate (Sine Values)')
plt.title('⭕ The Circle Rune of Infinite Motion')
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.axis('equal')
plt.xlim(-1.5, 1.5)
plt.ylim(-1.5, 1.5)

# Add concentric mystical effects
for radius in [0.5, 1.5]:
    effect_x = radius * np.cos(t_values)
    effect_y = radius * np.sin(t_values)
    plt.plot(effect_x, effect_y, 'cyan', alpha=0.2, linewidth=1, linestyle=':')

plt.tight_layout()
plt.show()

print("🧙‍♂️ PARAMETRIC MAGIC REVEALED:")
print()

# Demonstrate key properties
print(f"🎯 FUNDAMENTAL PROPERTIES:")
print(f"• Radius = 1 (unit circle)")
print(f"• Circumference = 2π ≈ {2*np.pi:.3f}")
print(f"• Area = π ≈ {np.pi:.3f}")
print(f"• Equation: x² + y² = 1")
print()

# Show how cos and sin relate to coordinates
print(f"📊 TRIGONOMETRIC INSIGHTS:")
sample_t = [0, np.pi/4, np.pi/2, np.pi, 3*np.pi/2]
print(f"{'t (rad)':<10} {'t (deg)':<8} {'cos(t)':<8} {'sin(t)':<8} {'Point':<12}")
print("-" * 50)
for t in sample_t:
    cos_t = np.cos(t)
    sin_t = np.sin(t)
    degrees = np.degrees(t)
    print(f"{t:<10.3f} {degrees:<8.0f} {cos_t:<8.3f} {sin_t:<8.3f} ({cos_t:.1f}, {sin_t:.1f})")
print()

# Verify the fundamental identity
print(f"✅ FUNDAMENTAL IDENTITY VERIFICATION:")
for t in [np.pi/6, np.pi/4, np.pi/3]:
    cos_t = np.cos(t)
    sin_t = np.sin(t)
    identity_check = cos_t**2 + sin_t**2
    print(f"t = {t:.3f}: cos²(t) + sin²(t) = {cos_t:.3f}² + {sin_t:.3f}² = {identity_check:.3f} ≈ 1 ✓")
print()

print("🔄 MOTION AND TRAJECTORIES:")
print("As parameter t increases from 0 to 2π:")
print("• Point traces counterclockwise around the circle")
print("• x(t) = cos(t) oscillates between -1 and +1")
print("• y(t) = sin(t) oscillates between -1 and +1")
print("• Speed is constant: 1 unit per radian")
print()

print("⚔️ PARAMETRIC CHALLENGES:")
print("1. What point corresponds to t = 5π/4?")
print("2. At what t values is x(t) = y(t)?")
print("3. Find t where the point is in the second quadrant with y = 0.6")
print()

print("🎓 DEEP CONNECTIONS TO ML:")
print("• Circular trajectories in optimization landscapes")
print("• Periodic activation functions (sin, cos)")
print("• Rotational transformations in neural networks")
print("• Fourier transforms and signal processing")
print("• Polar coordinate systems for data clustering")
print()

# Bonus: Show relationship to complex numbers
print("🌟 BONUS: COMPLEX NUMBER CONNECTION:")
print("The unit circle is intimately connected to complex numbers!")
print("e^(it) = cos(t) + i·sin(t) (Euler's formula)")
sample_t = np.pi/3
complex_point = complex(np.cos(sample_t), np.sin(sample_t))
print(f"At t = π/3: e^(iπ/3) = cos(π/3) + i·sin(π/3) = {complex_point:.3f}")
print()

print("🏆 CIRCLE RUNE MASTERY REWARDS:")
print("• 225 XP")
print("• Parametric Wizard Badge")
print("• Circular Motion Intuition +7")
print()
print("🚪 FINAL EPIC AWAITS: Portals of Planes - The 3D Dimension!")$$,
        'intermediate',
        '⚔️ Mathematical Quests'
    ),
    (
        'Portals of Planes: The 3D Finale',
        $$🌌 Master the mystical planes in 3D space and calculate the ultimate dihedral angle$$,
        $$# Challenge 10: Portals of Planes - The 3D Finale
# Enter the realm of 3D space where mystical planes intersect and create portals of power!

import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

print("🌌 THE PORTALS OF PLANES - FINAL CHALLENGE")
print("=" * 45)
print()
print("📖 The Dimensional Oracle speaks:")
print('"Brave adventurer, you have mastered the 2D realm..."')
print('"Now enter the third dimension where planes rule supreme!"')
print('"Two mystical planes await your analysis:"')
print('"Portal Alpha: 2x - 3y + z = 6"')
print('"Portal Beta: x + 4y - 2z = 8"')
print('"Find their intersection, angle, and a point on each plane!"')
print()

# Define the plane equations
# Plane 1: 2x - 3y + z = 6
# Plane 2: x + 4y - 2z = 8

normal1 = np.array([2, -3, 1])   # Normal vector to plane 1
normal2 = np.array([1, 4, -2])   # Normal vector to plane 2

print(f"🎯 PLANE EQUATIONS:")
print(f"Portal Alpha: 2x - 3y + z = 6")
print(f"Portal Beta: x + 4y - 2z = 8")
print()

print(f"📐 NORMAL VECTORS:")
print(f"n₁ = {normal1} (perpendicular to Portal Alpha)")
print(f"n₂ = {normal2} (perpendicular to Portal Beta)")
print()

# Create 3D visualization
fig = plt.figure(figsize=(15, 12))
ax = fig.add_subplot(111, projection='3d')

# Generate points on each plane for visualization
x_range = np.linspace(-2, 8, 10)
y_range = np.linspace(-2, 8, 10)
X, Y = np.meshgrid(x_range, y_range)

# Calculate z values for each plane
# Plane 1: z = 6 - 2x + 3y
Z1 = 6 - 2*X + 3*Y

# Plane 2: z = (8 - x - 4y) / 2
Z2 = (8 - X - 4*Y) / 2

# Draw the planes
ax.plot_surface(X, Y, Z1, alpha=0.3, color='red', label='Portal Alpha')
ax.plot_surface(X, Y, Z2, alpha=0.3, color='blue', label='Portal Beta')

# Find specific points on each plane
print("🎯 QUEST 1: Find Sample Points on Each Plane")
print()

# Point on plane 1: Let x=0, y=0, then z=6
point1_plane1 = np.array([0, 0, 6])
ax.scatter(*point1_plane1, color='red', s=100, label='Point on Alpha (0,0,6)')

# Point on plane 2: Let x=0, y=0, then z=4
point1_plane2 = np.array([0, 0, 4])
ax.scatter(*point1_plane2, color='blue', s=100, label='Point on Beta (0,0,4)')

print(f"✅ Sample point on Portal Alpha: {point1_plane1} (verify: 2(0) - 3(0) + 6 = 6 ✓)")
print(f"✅ Sample point on Portal Beta: {point1_plane2} (verify: 0 + 4(0) - 2(4) = -8... wait!)")
print("   Let me recalculate: x + 4y - 2z = 8 → 0 + 0 - 2z = 8 → z = -4")

# Correct point on plane 2
point1_plane2 = np.array([0, 0, -4])
ax.scatter(*point1_plane2, color='blue', s=100)
print(f"✅ Corrected point on Portal Beta: {point1_plane2} (verify: 0 + 0 - 2(-4) = 8 ✓)")
print()

print("🎯 QUEST 2: Calculate the Dihedral Angle")
print("The angle between planes equals the angle between their normal vectors!")
print()

# Calculate angle between normal vectors
dot_product = np.dot(normal1, normal2)
magnitude1 = np.linalg.norm(normal1)
magnitude2 = np.linalg.norm(normal2)

cos_theta = dot_product / (magnitude1 * magnitude2)
theta_radians = np.arccos(abs(cos_theta))  # Take absolute value for acute angle
theta_degrees = np.degrees(theta_radians)

print(f"📊 ANGLE CALCULATION:")
print(f"n₁ · n₂ = {normal1}·{normal2} = {normal1[0]}×{normal2[0]} + {normal1[1]}×{normal2[1]} + {normal1[2]}×{normal2[2]}")
print(f"       = {normal1[0]*normal2[0]} + {normal1[1]*normal2[1]} + {normal1[2]*normal2[2]} = {dot_product}")
print(f"|n₁| = √({normal1[0]}² + {normal1[1]}² + {normal1[2]}²) = √{np.sum(normal1**2)} = {magnitude1:.3f}")
print(f"|n₂| = √({normal2[0]}² + {normal2[1]}² + {normal2[2]}²) = √{np.sum(normal2**2)} = {magnitude2:.3f}")
print(f"cos(θ) = {dot_product} / ({magnitude1:.3f} × {magnitude2:.3f}) = {cos_theta:.3f}")
print(f"θ = arccos({cos_theta:.3f}) = {theta_degrees:.1f}°")
print()

# Draw normal vectors from origin
origin = np.array([0, 0, 0])
ax.quiver(*origin, *normal1, color='red', arrow_length_ratio=0.1, linewidth=3,
          alpha=0.8, label='Normal to Alpha')
ax.quiver(*origin, *normal2, color='blue', arrow_length_ratio=0.1, linewidth=3,
          alpha=0.8, label='Normal to Beta')

print("🎯 QUEST 3: Find the Line of Intersection")
print("When two planes intersect, they form a line!")
print()

# The direction vector of intersection line is cross product of normals
direction_vector = np.cross(normal1, normal2)
print(f"📏 Direction vector of intersection line:")
print(f"d = n₁ × n₂ = {normal1} × {normal2} = {direction_vector}")
print()

# To find a point on the line, we solve the system of equations
# Let z = 0 and solve for x, y
# 2x - 3y = 6
# x + 4y = 8

# From second equation: x = 8 - 4y
# Substitute into first: 2(8 - 4y) - 3y = 6
# 16 - 8y - 3y = 6
# -11y = -10
# y = 10/11

y_intersect = 10/11
x_intersect = 8 - 4*y_intersect
z_intersect = 0

intersection_point = np.array([x_intersect, y_intersect, z_intersect])
print(f"🎪 Point on intersection line (when z=0): ({x_intersect:.3f}, {y_intersect:.3f}, {z_intersect})")

# Draw intersection line segment
line_t = np.linspace(-3, 3, 100)
intersection_line = intersection_point[:, np.newaxis] + direction_vector[:, np.newaxis] * line_t
ax.plot(intersection_line[0], intersection_line[1], intersection_line[2],
        'gold', linewidth=4, label='Intersection Line')

ax.scatter(*intersection_point, color='gold', s=150, marker='*',
           label='Intersection Point')

# Set up the 3D plot
ax.set_xlabel('X-Axis')
ax.set_ylabel('Y-Axis')
ax.set_zlabel('Z-Axis')
ax.set_title('🌌 The Portals of Planes')
ax.legend()

# Set equal aspect ratio
ax.set_xlim([-2, 8])
ax.set_ylim([-2, 8])
ax.set_zlim([-2, 8])

plt.tight_layout()
plt.show()

print("🧙‍♂️ DIMENSIONAL MAGIC REVEALED:")
print()

print("📊 PLANE ANALYSIS SUMMARY:")
print(f"• Portal Alpha normal vector: {normal1}")
print(f"• Portal Beta normal vector: {normal2}")
print(f"• Dihedral angle between planes: {theta_degrees:.1f}°")
print(f"• Intersection line direction: {direction_vector}")
print(f"• Sample intersection point: ({x_intersect:.3f}, {y_intersect:.3f}, {z_intersect:.1f})")
print()

# Distance from origin to each plane
distance1 = abs(6) / magnitude1  # |ax + by + cz - d| / sqrt(a² + b² + c²)
distance2 = abs(8) / magnitude2

print(f"📏 DISTANCES FROM ORIGIN:")
print(f"• Portal Alpha distance: {distance1:.2f}")
print(f"• Portal Beta distance: {distance2:.2f}")
print()

print("⚔️ GRAND CHALLENGES:")
print("1. Find another point on the intersection line where x = 2")
print("2. What's the shortest distance between the two planes?")
print("3. Find a point equidistant from both planes")
print()

print("🎓 SUPREME WISDOM FOR ML:")
print("🌟 HYPERPLANES & DECISION BOUNDARIES:")
print("• Each plane is a 2D hyperplane in 3D space")
print("• In ML, hyperplanes separate different classes")
print("• Normal vectors point in direction of steepest ascent")
print("• Angle between planes → angle between decision boundaries")
print()

print("🌟 SUPPORT VECTOR MACHINES:")
print("• Maximum margin = maximum angle between support hyperplanes")
print("• Normal vectors become weight vectors in SVM")
print("• Distance from origin = bias term in linear models")
print()

print("🌟 NEURAL NETWORKS:")
print("• Each neuron defines a hyperplane")
print("• Network learns optimal hyperplane orientations")
print("• Multiple planes create complex decision regions")
print()

print("🏆 DIMENSIONAL MASTERY - ULTIMATE REWARDS:")
print("• 300 XP (MAXIMUM ACHIEVEMENT!)")
print("• 3D Spatial Master Badge")
print("• Hyperplane Sage Title")
print("• ML Intuition MAXED OUT!")
print()

print("🎉 CONGRATULATIONS, DIMENSIONAL CHAMPION!")
print("="*50)
print("You have conquered all 10 challenges of the Mathematical Realm!")
print("Your journey through vectors, lines, curves, and planes is complete.")
print("The foundations of AI/ML now flow through your mathematical soul.")
print()
print("🚪 The portal to Module 1 now opens before you...")
print("Where linear algebra, statistics, and machine learning await!")
print()
print("May your algorithms be optimal and your gradients descend swiftly!")
print("🎓✨🚀")$$,
        'advanced',
        '⚔️ Mathematical Quests'
    );

