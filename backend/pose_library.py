"""
Iris Atelier - Pure Angle & Pose Library (Zero-Place Interference)
100 pure camera angles, perspectives, body poses, and gestures.
Strictly free of locations, rooms, furniture, or background props.
"""

POSE_LIBRARY = [
    # Group 1: Facial Close-Ups & Head Angles (1-15)
    {
        "id": 1,
        "name": "Front View Close-Up",
        "category": "Portraits & Close-Ups",
        "prompt": "extreme close-up, front view, eye-level, intense direct gaze, sharp eye focus, neutral framing"
    },
    {
        "id": 2,
        "name": "Dutch Angle Portrait",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up portrait, dutch angle, dramatic tilted camera, sharp focus, direct eye contact"
    },
    {
        "id": 3,
        "name": "3/4 View Head Tilt",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, 3/4 view, head tilted slightly to the side, soft contemplative gaze"
    },
    {
        "id": 4,
        "name": "Side Profile View",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, side profile view, sharp jawline, looking straight ahead, clean silhouette"
    },
    {
        "id": 5,
        "name": "Low Angle Looking Down",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, from below, low angle portrait, looking down at camera, confident imposing gaze"
    },
    {
        "id": 6,
        "name": "High Angle Looking Up",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, from above, high angle view, looking up at camera, wide eyes, tilted head"
    },
    {
        "id": 7,
        "name": "Looking Over Shoulder",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, looking back over shoulder, 3/4 turn, neck line, mysterious glance"
    },
    {
        "id": 8,
        "name": "Peeking Through Bangs",
        "category": "Portraits & Close-Ups",
        "prompt": "extreme close-up, macro eye shot, peeking through hair bangs, mysterious half-shadow"
    },
    {
        "id": 9,
        "name": "Chin Resting on Hand",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up portrait, head resting on tilted palm, chin on hand, relaxed lazy expression"
    },
    {
        "id": 10,
        "name": "Hands Framing Cheeks",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, both hands framing cheeks, fingers touching jawline, playful smirk"
    },
    {
        "id": 11,
        "name": "Finger on Lip",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, one hand touching lips, index finger on bottom lip, pensive thoughtful pose"
    },
    {
        "id": 12,
        "name": "Head Tilted Back",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, head thrown back slightly, laughing or exhaling, upward chin angle"
    },
    {
        "id": 13,
        "name": "Symmetrical Eye-Level",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up portrait, straight eye-level view, symmetrical framing, serene calm expression"
    },
    {
        "id": 14,
        "name": "Shielding Forehead",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, one hand shielding forehead, looking through fingers, slight squint"
    },
    {
        "id": 15,
        "name": "Rear View Profile Turn",
        "category": "Portraits & Close-Ups",
        "prompt": "close-up, view from behind, head turned 90 degrees in profile, elegant neck angle"
    },

    # Group 2: Standing Poses & Weight Shifts (16-35)
    {
        "id": 16,
        "name": "Hip Shift Relaxed",
        "category": "Standing Poses",
        "prompt": "full body, straight standing pose, weight shifted to one hip, relaxed posture, arms at sides"
    },
    {
        "id": 17,
        "name": "Hands in Pockets",
        "category": "Standing Poses",
        "prompt": "full body, standing with hands in pockets, slouching shoulders, effortless cool stance"
    },
    {
        "id": 18,
        "name": "Arms Crossed Under Chest",
        "category": "Standing Poses",
        "prompt": "three-quarter body, standing with arms crossed beneath chest, confident firm posture"
    },
    {
        "id": 19,
        "name": "One Hand on Hip",
        "category": "Standing Poses",
        "prompt": "full body, standing with one hand on hip, other arm hanging loose, stylish model stance"
    },
    {
        "id": 20,
        "name": "Both Hands on Hips",
        "category": "Standing Poses",
        "prompt": "full body, standing with both hands on hips, feet shoulder-width apart, assertive posture"
    },
    {
        "id": 21,
        "name": "Walking Toward Camera",
        "category": "Standing Poses",
        "prompt": "full body, walking toward camera, dynamic mid-stride pose, front leg forward, natural motion"
    },
    {
        "id": 22,
        "name": "Walking Away Looking Back",
        "category": "Standing Poses",
        "prompt": "full body, walking away from camera, looking back over shoulder, dynamic step"
    },
    {
        "id": 23,
        "name": "Ankles Crossed Lean",
        "category": "Standing Poses",
        "prompt": "full body, standing with ankles crossed, leaning slightly to one side, casual balance"
    },
    {
        "id": 24,
        "name": "Hands Behind Back Leaning",
        "category": "Standing Poses",
        "prompt": "full body, hands clasped behind back, leaning forward from waist, inquisitive posture"
    },
    {
        "id": 25,
        "name": "Overhead Stretch",
        "category": "Standing Poses",
        "prompt": "upper body, both arms raised stretching overhead, interlocked fingers, arched spine"
    },
    {
        "id": 26,
        "name": "Adjusting Collar",
        "category": "Standing Poses",
        "prompt": "three-quarter body, one arm raised adjusting collar or jacket lapel, elegant gesture"
    },
    {
        "id": 27,
        "name": "Dynamic Spin Mid-Turn",
        "category": "Standing Poses",
        "prompt": "full body, dynamic mid-turn spin, body rotating, clothes and hair flowing with inertia"
    },
    {
        "id": 28,
        "name": "Wide Stance Assertive",
        "category": "Standing Poses",
        "prompt": "full body, standing tall with feet wide apart, shoulders square, commanding presence"
    },
    {
        "id": 29,
        "name": "Torso Twist Profile",
        "category": "Standing Poses",
        "prompt": "three-quarter body, standing sideways, upper torso twisted toward camera, dynamic silhouette"
    },
    {
        "id": 30,
        "name": "One Leg Lifted Flamingo",
        "category": "Standing Poses",
        "prompt": "full body, one leg lifted slightly behind, playful flamingo stance, casual balance"
    },
    {
        "id": 31,
        "name": "Hands Behind Head",
        "category": "Standing Poses",
        "prompt": "upper body, both hands behind head, elbows pointed outwards, confident relaxed posture"
    },
    {
        "id": 32,
        "name": "One Foot Forward Lean",
        "category": "Standing Poses",
        "prompt": "full body, standing with one foot stepped forward, weight forward, leaning toward viewer"
    },
    {
        "id": 33,
        "name": "Casual Slouched Shoulders",
        "category": "Standing Poses",
        "prompt": "three-quarter body, arms hanging loose, shoulders slightly hunched forward, cool slouch"
    },
    {
        "id": 34,
        "name": "Hands on Thighs Bow",
        "category": "Standing Poses",
        "prompt": "full body, standing with hands pressed down on thighs, slight forward bow, attentive pose"
    },
    {
        "id": 35,
        "name": "Touching Collarbone Profile",
        "category": "Standing Poses",
        "prompt": "full body, standing in profile, one arm straight down, other hand touching collarbone"
    },

    # Group 3: Sitting Poses (Universal / No Specific Furniture) (36-55)
    {
        "id": 36,
        "name": "Legs Crossed at Knees",
        "category": "Sitting Poses",
        "prompt": "full body, sitting pose, legs crossed at knees, hands resting in lap, upright posture"
    },
    {
        "id": 37,
        "name": "Cross-Legged Agura",
        "category": "Sitting Poses",
        "prompt": "full body, sitting cross-legged, agura pose, hands resting on knees, relaxed spine"
    },
    {
        "id": 38,
        "name": "Knees Drawn Up",
        "category": "Sitting Poses",
        "prompt": "full body, sitting with knees drawn up, arms wrapped loosely around knees, compact pose"
    },
    {
        "id": 39,
        "name": "Legs Outstretched Leaning Back",
        "category": "Sitting Poses",
        "prompt": "full body, sitting with legs stretched out forward, hands planted behind for support, leaning back"
    },
    {
        "id": 40,
        "name": "Wariza Side-Sit",
        "category": "Sitting Poses",
        "prompt": "full body, sitting with legs folded to one side, wariza side-sit, gentle feminine pose"
    },
    {
        "id": 41,
        "name": "Elbows on Knees Forward Lean",
        "category": "Sitting Poses",
        "prompt": "three-quarter body, sitting leaning forward, elbows resting on knees, hands loosely clasped"
    },
    {
        "id": 42,
        "name": "Sitting Sideways Twist",
        "category": "Sitting Poses",
        "prompt": "three-quarter body, sitting sideways, one arm draped over backrest or knee, relaxed twist"
    },
    {
        "id": 43,
        "name": "One Knee to Chest",
        "category": "Sitting Poses",
        "prompt": "full body, sitting with one knee pulled up to chest, other leg resting flat, asymmetrical pose"
    },
    {
        "id": 44,
        "name": "Ankles Crossed Palm Support",
        "category": "Sitting Poses",
        "prompt": "full body, sitting with ankles crossed, leaning back on one palm, casual relaxed sit"
    },
    {
        "id": 45,
        "name": "Formal Hands on Thighs",
        "category": "Sitting Poses",
        "prompt": "medium shot, sitting upright, hands resting flat on thighs, formal posture, straight spine"
    },
    {
        "id": 46,
        "name": "Legs Wide Chin in Hands",
        "category": "Sitting Poses",
        "prompt": "full body, sitting with legs wide, elbows propped on knees, chin resting in hands, bored slouch"
    },
    {
        "id": 47,
        "name": "Forearm Ground Support",
        "category": "Sitting Poses",
        "prompt": "full body, sitting leaning sideways, supported by one forearm on ground, relaxed body angle"
    },
    {
        "id": 48,
        "name": "Stacked Fists Chin Rest",
        "category": "Sitting Poses",
        "prompt": "three-quarter body, sitting with chin resting on stacked fists, elbows forward, attentive look"
    },
    {
        "id": 49,
        "name": "Slouched Head Upward",
        "category": "Sitting Poses",
        "prompt": "full body, sitting slouched back, head tilted upward toward ceiling, lazy relaxed posture"
    },
    {
        "id": 50,
        "name": "Cheek on Knee Hug",
        "category": "Sitting Poses",
        "prompt": "full body, sitting hugging one leg against chest, cheek resting on knee, thoughtful mood"
    },
    {
        "id": 51,
        "name": "Touching Hair Sideways",
        "category": "Sitting Poses",
        "prompt": "three-quarter body, sitting upright, one hand touching hair, legs angled to side"
    },
    {
        "id": 52,
        "name": "Prim Knees Together",
        "category": "Sitting Poses",
        "prompt": "full body, sitting with feet flat on ground, knees together, hands folded on knees, prim posture"
    },
    {
        "id": 53,
        "name": "Chest Open Back Lean",
        "category": "Sitting Poses",
        "prompt": "full body, sitting leaning backwards on both extended arms, chest opened upward, relaxed posture"
    },
    {
        "id": 54,
        "name": "Hands Between Knees Lean",
        "category": "Sitting Poses",
        "prompt": "three-quarter body, sitting leaning forward with hands between knees, casual candid pose"
    },
    {
        "id": 55,
        "name": "Perched Feet Tucked",
        "category": "Sitting Poses",
        "prompt": "full body, sitting perched with feet tucked under, upright balanced silhouette"
    },

    # Group 4: Squatting, Kneeling & Ground Postures (56-75)
    {
        "id": 56,
        "name": "Deep Flat-Footed Squat",
        "category": "Squatting & Kneeling",
        "prompt": "full body, deep flat-footed squat, elbows resting on knees, tough athletic posture"
    },
    {
        "id": 57,
        "name": "Alert Balls-of-Feet Crouch",
        "category": "Squatting & Kneeling",
        "prompt": "full body, low crouch on balls of feet, one knee angled outwards, alert low stance"
    },
    {
        "id": 58,
        "name": "Three-Point Athletic Crouch",
        "category": "Squatting & Kneeling",
        "prompt": "full body, three-point crouch, one hand touching ground, athletic sprinter stance"
    },
    {
        "id": 59,
        "name": "Seiza Kneeling Formal",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling seiza pose, shins flat on ground, sitting on heels, formal upright spine"
    },
    {
        "id": 60,
        "name": "Upright Kneeling on Knees",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling upright on knees, thighs vertical, hands on hips, confident pose"
    },
    {
        "id": 61,
        "name": "One-Knee Knight Pose",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling on one knee, other knee bent 90 degrees forward, knight kneeling pose"
    },
    {
        "id": 62,
        "name": "Low Defensive Crouch",
        "category": "Squatting & Kneeling",
        "prompt": "full body, dropping down into low defensive crouch, arms raised protectively, dynamic tension"
    },
    {
        "id": 63,
        "name": "Wide V-Split Floor Sit",
        "category": "Squatting & Kneeling",
        "prompt": "full body, sitting on floor in wide V-split, hands planted between legs, athletic flexibility"
    },
    {
        "id": 64,
        "name": "W-Sitting Floor Pose",
        "category": "Squatting & Kneeling",
        "prompt": "full body, W-sitting position on floor, knees together feet flared outwards, domestic cute sit"
    },
    {
        "id": 65,
        "name": "Ball Crouch Knees Hugged",
        "category": "Squatting & Kneeling",
        "prompt": "full body, low crouch, hugging knees tightly, compact ball silhouette, looking forward"
    },
    {
        "id": 66,
        "name": "Deep Kneeling Bow",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling with torso bent forward, forehead almost touching ground, low bow"
    },
    {
        "id": 67,
        "name": "All-Fours Crawl Stance",
        "category": "Squatting & Kneeling",
        "prompt": "full body, on all fours, hands and knees on ground, head lifted looking directly at camera"
    },
    {
        "id": 68,
        "name": "Arched Back Kneeling",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling on both knees, torso arched backward, hands on calves or hips"
    },
    {
        "id": 69,
        "name": "Side Leg Out Squat",
        "category": "Squatting & Kneeling",
        "prompt": "full body, low squat with one leg extended straight out to side, martial arts stretch pose"
    },
    {
        "id": 70,
        "name": "Back on Heels Hand Plant",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling sitting back on heels, leaning back with hands planted behind, arched torso"
    },
    {
        "id": 71,
        "name": "One Palm Floor Touch",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling with one hand flat on floor, other hand touching chest, poised stance"
    },
    {
        "id": 72,
        "name": "Squat Arms Over Knees",
        "category": "Squatting & Kneeling",
        "prompt": "full body, deep squat, chin resting on crossed arms over knees, relaxed waiting pose"
    },
    {
        "id": 73,
        "name": "Butterfly Soles Touching",
        "category": "Squatting & Kneeling",
        "prompt": "full body, sitting on floor with soles of feet touching together, butterfly stretch pose"
    },
    {
        "id": 74,
        "name": "Clasped Hands Kneeling",
        "category": "Squatting & Kneeling",
        "prompt": "full body, kneeling upright, hands clasped together at chest level, earnest expression"
    },
    {
        "id": 75,
        "name": "Low Reach Toward Camera",
        "category": "Squatting & Kneeling",
        "prompt": "full body, crouched low, one arm outstretched reaching toward camera, foreshortened perspective"
    },

    # Group 5: Prone, Supine & Reclining Poses (Lying Down) (76-88)
    {
        "id": 76,
        "name": "Flat on Back Arms Spread",
        "category": "Lying & Reclining",
        "prompt": "full body, lying flat on back, arms spread out to sides, relaxed supine posture, looking straight up"
    },
    {
        "id": 77,
        "name": "One Knee Raised Supine",
        "category": "Lying & Reclining",
        "prompt": "full body, lying on back with one knee raised, hands resting on stomach, peaceful indolence"
    },
    {
        "id": 78,
        "name": "Curled on Side Loose Fetal",
        "category": "Lying & Reclining",
        "prompt": "full body, lying on side, curled slightly into loose fetal posture, hand tucked under cheek"
    },
    {
        "id": 79,
        "name": "Stomach Kicking Feet Up",
        "category": "Lying & Reclining",
        "prompt": "full body, lying prone on stomach, propped up on both elbows, chin resting in hands, feet kicked up behind"
    },
    {
        "id": 80,
        "name": "Flat on Stomach Limp",
        "category": "Lying & Reclining",
        "prompt": "full body, lying flat on stomach, head turned to the side resting flat, relaxed limp limbs"
    },
    {
        "id": 81,
        "name": "Propped on One Elbow",
        "category": "Lying & Reclining",
        "prompt": "full body, lying on side propped up on one elbow, looking toward camera, long reclining silhouette"
    },
    {
        "id": 82,
        "name": "Top-Down Diagonal Splay",
        "category": "Lying & Reclining",
        "prompt": "full body, top-down view, lying diagonal, one arm thrown over eyes, lazy sleeping pose"
    },
    {
        "id": 83,
        "name": "Hands as Pillow Supine",
        "category": "Lying & Reclining",
        "prompt": "upper body, lying on back, arms tucked behind head as makeshift pillow, calm gaze"
    },
    {
        "id": 84,
        "name": "Outstretched Arm on Side",
        "category": "Lying & Reclining",
        "prompt": "full body, lying on side, one arm outstretched forward, knees softly bent, tranquil posture"
    },
    {
        "id": 85,
        "name": "Legs Kicked in Air",
        "category": "Lying & Reclining",
        "prompt": "full body, lying on back with legs kicked straight up into air, playful casual stretch"
    },
    {
        "id": 86,
        "name": "Head on Folded Forearms",
        "category": "Lying & Reclining",
        "prompt": "medium shot, lying on stomach, head resting flat on folded forearms, half-lidded sleepy eyes"
    },
    {
        "id": 87,
        "name": "Reclined on Elbows 45°",
        "category": "Lying & Reclining",
        "prompt": "full body, reclined back at 45 degree angle on elbows, legs relaxed forward, looking down"
    },
    {
        "id": 88,
        "name": "Head Tilted Back Inverted",
        "category": "Lying & Reclining",
        "prompt": "full body, lying on back with head tilted back toward camera, inverted perspective view"
    },

    # Group 6: Pure Camera Angles & Perspective Dynamics (89-100)
    {
        "id": 89,
        "name": "Worm's-Eye Upward Tilt",
        "category": "Perspective Extremes",
        "prompt": "from below, extreme low angle worm's-eye view, dramatic upward tilt, towering imposing perspective"
    },
    {
        "id": 90,
        "name": "Bird's-Eye Perpendicular",
        "category": "Perspective Extremes",
        "prompt": "from above, extreme high angle bird's-eye view, looking straight down, dynamic foreshortening"
    },
    {
        "id": 91,
        "name": "Action Dutch Tilt Angle",
        "category": "Perspective Extremes",
        "prompt": "dutch angle, extreme tilted camera horizon, dynamic diagonal framing, action film still"
    },
    {
        "id": 92,
        "name": "Fisheye Lens Barrel Distortion",
        "category": "Perspective Extremes",
        "prompt": "fisheye lens, dramatic barrel distortion, rounded wide-angle perspective, dynamic close foreground"
    },
    {
        "id": 93,
        "name": "Wide Cowboy Shot",
        "category": "Perspective Extremes",
        "prompt": "wide shot, cowboy framing, medium-long distance, complete character silhouette in center"
    },
    {
        "id": 94,
        "name": "Over-The-Shoulder Framing",
        "category": "Perspective Extremes",
        "prompt": "over-the-shoulder perspective, camera positioned behind an unseen shoulder, framing character"
    },
    {
        "id": 95,
        "name": "Telephoto Subject Isolation",
        "category": "Perspective Extremes",
        "prompt": "telephoto lens view, compressed perspective, shallow depth of field, sharp subject isolation"
    },
    {
        "id": 96,
        "name": "Top-Down 90° Overhead",
        "category": "Perspective Extremes",
        "prompt": "straight 90-degree overhead shot, top-down perpendicular perspective, flat planar composition"
    },
    {
        "id": 97,
        "name": "Ground-Level Pavement Angle",
        "category": "Perspective Extremes",
        "prompt": "ground-level camera, camera resting on the ground looking slightly upward, strong depth"
    },
    {
        "id": 98,
        "name": "Cinematic Letterbox Profile",
        "category": "Perspective Extremes",
        "prompt": "side profile medium shot, cinematic letterbox framing, horizontal composition, looking across frame"
    },
    {
        "id": 99,
        "name": "30° Low Dutch Tilt",
        "category": "Perspective Extremes",
        "prompt": "dramatic low-angle Dutch tilt, camera tilted 30 degrees from below, powerful dynamic energy"
    },
    {
        "id": 100,
        "name": "Rule-of-Thirds Eye Level",
        "category": "Perspective Extremes",
        "prompt": "eye-level medium shot, centered rule-of-thirds framing, classic cinematic portrait angle"
    }
]

def get_pose_burst_modifiers(count: int = 100) -> list:
    """
    Returns curated pure angle modifiers strictly based on the requested count: 10, 50, or 100.
    """
    if count == 10:
        # 10 carefully balanced, widely varied archetypal angles across all groups
        indices = [0, 1, 6, 15, 20, 36, 42, 55, 58, 78]
        return [POSE_LIBRARY[i] for i in indices]
    elif count == 50:
        # 50 evenly spaced distinct angles
        step = len(POSE_LIBRARY) / 50.0
        indices = [int(i * step) for i in range(50)]
        return [POSE_LIBRARY[i] for i in indices]
    else:
        # Full 100 pose matrix
        return POSE_LIBRARY[:100]
