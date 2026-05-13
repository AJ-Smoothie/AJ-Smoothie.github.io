# Rack & Pinion Calculator

A clean, reusable way to convert rack travel into pinion tooth count.

## The Idea

Calculating the distance a rack will move is actually a lot easier than you think *(haha just kidding :)*. We can think of the rack as a regular gear. After doing the calculations on it, we can "unroll" that gear, using the circumference of the gear as the rack length.

## The Formulas

Variables:

- $R_L$ = rack length (mm)
- $m$ = module
- $T_C$ = tooth count
- $\theta$ = available rotation (degrees)
- $G$ = rack movement multiplier from the gear ratio
- $P_D$ = pitch diameter
- $\tau$ = torque
- $r$ = pitch radius
- $F$ = linear force at the pitch diameter

### Formula 1: Pitch Diameter

$$
P_D = T_C \cdot m
$$

### Formula 2: Linear Force at the Pitch Diameter

$$
F = \frac{\tau}{r}, \quad r = \frac{P_D}{2}
$$

### Formula 3: Tooth Count from Rack Length

$$
T_C = \frac{R_L}{\pi \cdot m}
$$

### Formula 4: Rack Length from Tooth Count

$$
R_L = T_C \cdot \pi \cdot m
$$

### Formula 5: Limited Pinion Rotation

When the pinion does not rotate a full $360^\circ$:

$$
T_C = \frac{R_L}{\pi \cdot m \cdot \frac{\theta}{360}}
$$

### Formula 6: Limited Rotation with Gear Ratio

When the pinion does not rotate a full $360^\circ$, and the rack movement is multiplied by gear ratio $G$:

$$
T_C = \frac{R_L}{\pi \cdot m \cdot \frac{\theta \cdot G}{360}}
$$

### Formula 7: Rack Travel from Pinion Rotation

When setting up a motion link, the rack travel is the same as the fraction of the pinion pitch circumference that has rolled along the rack:

$$
R_L = T_C \cdot \pi \cdot m \cdot \frac{\theta}{360}
$$

This is **Formula 4** scaled by the fraction of a full turn. A full $360^\circ$ rotation moves the rack by one full pinion pitch circumference. A partial rotation moves the rack by that same fraction of the circumference.

## Example: ASA's Re-arming Mechanism

### Pre-requisites

- Servo travel: $100^\circ$
- Servo force: $45kg \cdot cm$
- Force required: $>5kg$
- Travel of rack required: $~20mm$
- Module: $1$
- Pressure angle: $20^\circ$
- Backlash: $0.15mm$
+
### Working

20mm of travel is required for the rack. Therefore, we can use **Formula 3** to find the needed rack tooth count:

$$
T_C = \frac{20}{\pi \cdot 1} = 6.37
$$

Round up to **7 rack teeth**. Backstop teeth can be added later.

Since the rack tooth count was rounded up to **7**, find the new corresponding rack length using **Formula 4**:

$$
R_L = 7 \cdot \pi \cdot 1 = 21.99mm
$$

We want the rack to receive the equivalent of one full pinion rotation, which is $360^\circ$. That corresponds to the new rack movement of $21.99mm$. A 1:1 drive would need the servo pinion to rotate $360^\circ$, but the servo can only rotate $100^\circ$.

This gives a motion ratio, **not a tooth ratio**, of:

$$
G = \frac{\text{required rack-equivalent rotation}}{\text{available servo rotation}} = \frac{360^\circ}{100^\circ} = 3.6
$$

So the mechanism needs a $3.6:1$ motion increase from the servo to the rack. The rack moves 3.6 times farther than it would with a direct 1:1 drive, but with 3.6 times less available force.

Because the servo-driven pinion must create that motion increase, the physical tooth relationship is written the other way around:

$$
G = \frac{\text{pinion teeth}}{\text{rack teeth}}
$$

Therefore:

$$
T_{C(pinion)} = T_{C(rack)} \cdot G = 7 \cdot 3.6 = 25.2
$$

Round the pinion up from 25.2 teeth to **26 teeth**.

!!! note
    After rounding, the actual tooth ratio is no longer exactly $3.6:1$. It is:
    $$
    \frac{26 \text{ pinion teeth}}{7 \text{ rack teeth}} = 3.71:1
    $$

Now calculate the force at the pitch diameter:

- Servo torque: $45kg \cdot cm$
- Pinion pitch diameter, using **Formula 1**:

$$
P_D = T_{C(pinion)} \cdot m = 26mm
$$

Calculate the available linear force at the pitch diameter using **Formula 2**:

$$
F = \frac{\tau}{r}, \quad r = \frac{P_D}{2}
$$

Since $P_D = 26mm = 2.6cm$, $r = 1.3cm$. Therefore:

$$
F = \frac{45kg \cdot cm}{1.3cm} = 34.6kg
$$

Now apply the motion increase. Since the rack moves farther, the available rack force is reduced by the same ratio.

!!! note
    The actual ratio changed when the gears were rounded from 6.37 to 7 rack teeth and from 25.2 to 26 pinion teeth. The actual tooth ratio is:
    $$
    \frac{26 \text{ pinion teeth}}{7 \text{ rack teeth}} = 3.71:1
    $$

That reduces the available rack force to:

$$
\frac{34.6kg}{3.71} = 9.33kg
$$

There will be more losses than the math shows, but that is still comfortably above the required $3.6kg_{(max)}$.

Any additional teeth on the **rack** do not affect the ratios; they are just added as backstops. Do not add any teeth on the pinion, because that changes the diameter and therefore the ratio.

### Understanding Rack Movement

The confusing part is the rack tooth count. Once the rack is modeled as a straight rack, the rack tooth count does **not** determine the motion ratio. The rack tooth count was only used earlier to decide how much linear travel we needed.

The thing that determines how far the rack moves is the pinion pitch diameter, which comes from the pinion tooth count and module. The rack moves by the amount of pinion pitch circumference that rolls along it.

> You can think of this just like a tire rolling on the ground. It's literally the exact same concept!

So do not think of the rack as getting "$3.71x more revolutions" than the pinion. The rack does not revolve at all. It just slides. The final rack travel is literally determined by how much the pinion rotates.

The $21.99mm$ value came from the rounded 7-tooth rack equivalent over a full $360^\circ$ turn:

$$
7 \cdot \pi = 21.99mm
$$

But after rounding the pinion to **26 teeth**, the actual motion ratio is $3.71:1$, not $3.6:1$. For the final rack movement, use the actual 26-tooth pinion, because that is the gear physically rolling against the rack.

Use **Formula 7**:

$$
R_L = 26 \cdot \pi \cdot \frac{100^\circ}{360^\circ} = 22.69mm
$$

This works because a 26-tooth module 1 pinion has a full pitch circumference of:

$$
26 \cdot \pi = 81.68mm
$$

The servo only turns $100^\circ$, which is:

$$
\frac{100^\circ}{360^\circ} = 0.2778
$$

So the rack moves $27.78\%$ of the pinion's full pitch circumference:

$$
81.68mm \cdot 0.2778 = 22.69mm
$$

!!! warning
    The $3.71:1$ ratio explains why the pinion became 26 teeth, but the rack travel itself is still calculated from the pinion's actual rotation and pitch circumference.

### Fusion Motion Link Setup

The Fusion question is simply:

> How much rack travel happens when the **26-tooth pinion** rotates by $100^\circ$?

In Fusion, set the motion link to approximately **22.69mm of rack travel per 100 degrees of pinion rotation**, not 21.99mm per 100 degrees.



### Summary

- Servo travel available: $100^\circ$
- Required rack movement: $20mm$
- Rounded rack design length: $21.99mm$
- Final rack travel from 26-tooth pinion over $100^\circ$: $22.69mm$
- Rack tooth count used: $7$ teeth, plus any backstop teeth needed
- Pinion tooth count used: $26$ teeth
- Motion ratio needed: $\frac{360^\circ}{100^\circ} = 3.6:1$
- Actual tooth ratio after rounding: $\frac{26}{7} = 3.71:1$
- Pinion pitch diameter: $26mm$
- Force at pinion pitch diameter before ratio loss: $34.6kg$
- Final estimated rack force after ratio loss: $9.33kg$
- Required force: $3.6kg$
- Estimated safety margin: $\frac{9.33kg}{3.6kg} = 2.59x$
