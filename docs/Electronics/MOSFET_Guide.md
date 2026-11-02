# MOSFET Gate-Drive Design: A Practical Worked Example

**Example:** Switch a 12 V, 2 A DC load using a 5 V microcontroller and a **DMN3023L-7** N-channel MOSFET. This is a low-side switch: the load connects between +12 V and the MOSFET drain; the source connects to ground. MCU ground and 12 V supply ground are common.

**Datasheet:** [Diodes Incorporated — DMN3023L](https://www.diodes.com/assets/Datasheets/DMN3023L.pdf)

## Starting values

| Quantity | Value |
|---|---:|
| MCU high output | 5 V |
| MCU maximum GPIO source current | 25 mA (design assumption) |
| Desired initial gate-current limit | ~18 mA |
| Load supply | 12 V |
| Load current | 2 A |
| MOSFET total gate charge, Qg | 8.3 nC at VGS = 4.5 V |
| MOSFET maximum RDS(on) | 28 mΩ at VGS = 4.5 V |
| Rated continuous drain current | 5.8 A at TA = 25 °C, under specified conditions |
| Junction-to-ambient thermal resistance, minimum pad layout | 144 °C/W |
| Junction-to-ambient thermal resistance, larger copper layout | 97 °C/W |
| Ambient temperature for example | 25 °C |

## 1. Understanding the MOSFET gate

A MOSFET gate behaves mainly like a capacitor. The MCU supplies a brief pulse of current to charge it when turning the MOSFET **on**, and removes that charge when turning it **off**. Once charged, the gate needs essentially no continuous DC current.

The useful datasheet number is **total gate charge**, Qg, rather than trying to treat the gate as a fixed resistor. Our MOSFET lists **8.3 nC at 4.5 V**.

## 2. Choosing a reasonable turn-on target

For an ordinary on/off DC load, **about 1 microsecond (1 µs)** is a convenient starting target for charging the gate. It is fast compared with a human-operated switch, without demanding extreme GPIO current. We are choosing a practical design scale, not specifying an exact measured drain-current rise time.

## 3. Estimating average gate-charging current

**Formula**

\[
I_{G,avg}=\frac{Q_g}{t}
\]

Where:
- `I_G,avg` = average gate-charging current, in amperes (A)
- `Q_g` = total gate charge, in coulombs (C)
- `t` = selected charging time, in seconds (s)

**Substitute**

\[
I_{G,avg}=\frac{8.3\times10^{-9}\ \mathrm C}{1\times10^{-6}\ \mathrm s}
=0.0083\ \mathrm A=\boxed{8.3\ \mathrm{mA}}
\]

This is an **average** during charging, not the maximum instantaneous GPIO current. Next, we choose a resistor to control that initial peak.

## 4. Selecting the gate resistor

The resistor sits **in series between the MCU pin and the MOSFET gate**. We want to keep the initial current around 18 mA, below our assumed 25 mA GPIO limit.

**Formula (Ohm's law)**

\[
R_G=\frac{V_{GPIO}}{I_{G,peak}}
\]

Where:
- `R_G` = external series gate resistance, in ohms (Ω)
- `V_GPIO` = MCU output-high voltage, in volts (V)
- `I_G,peak` = chosen approximate initial gate-current limit, in amperes (A)

**Substitute**

\[
R_G=\frac{5\ \mathrm V}{0.018\ \mathrm A}=277.8\ \Omega
\]

Choose a standard **270 Ω** resistor.

**Check initial peak current**

\[
I_{G,peak}\approx\frac{V_{GPIO}}{R_G}
=\frac{5\ \mathrm V}{270\ \Omega}
=\boxed{18.5\ \mathrm{mA}}
\]

The MOSFET and MCU also have internal resistance, so actual initial current will be somewhat lower. The gate current then falls as the gate charges. The selected resistor is a practical current-limiting choice; the 1 µs estimate is not an exact timing guarantee.

**Add a 10 kΩ gate-to-source pulldown.** It keeps the MOSFET off while the MCU pin is floating, such as during startup. This is a separate resistor, **not** the 270 Ω series resistor.

## 5. What happens when the switch turns on?

With the MCU output low, the gate is near 0 V, the MOSFET is off, and the 12 V load has no intended current path through the MOSFET.

With the MCU output high, the gate charges toward 5 V through the 270 Ω resistor. The MOSFET turns on and carries the load's **2 A drain current**. The gate does **not** carry that 2 A; it only controls the conducting channel.

During the brief transition, the MOSFET is neither fully off nor fully on, so it dissipates some extra energy. For this occasional DC on/off example, steady-state conduction heating is the useful first calculation. No PWM analysis is needed.

## 6. Calculating on-state voltage drop and power

The datasheet specifies **RDS(on) = 28 mΩ maximum at VGS = 4.5 V**. Our 5 V drive is sufficient to use this as a conservative nominal design resistance for the worked example.

**Formula: voltage drop**

\[
V_{DS(on)}=I_D\,R_{DS(on)}
\]

Where:
- `V_DS(on)` = drain-to-source voltage while on, in volts (V)
- `I_D` = drain/load current, in amperes (A)
- `R_DS(on)` = on-state drain-to-source resistance, in ohms (Ω)

**Substitute**

\[
V_{DS(on)}=(2\ \mathrm A)(0.028\ \Omega)
=\boxed{0.056\ \mathrm V=56\ \mathrm{mV}}
\]

**Formula: conduction power**

\[
P_{cond}=I_D^2R_{DS(on)}
\]

Where:
- `P_cond` = MOSFET conduction loss, in watts (W)
- `I_D` = drain current, in amperes (A)
- `R_DS(on)` = on-state resistance, in ohms (Ω)

**Substitute**

\[
P_{cond}=(2\ \mathrm A)^2(0.028\ \Omega)
=\boxed{0.112\ \mathrm W=112\ \mathrm{mW}}
\]

The MOSFET dissipates about **112 mW** while continuously carrying 2 A at this resistance. The **load** receives almost the full 12 V.

## 7. Estimating junction temperature

The PCB affects how effectively heat escapes from the MOSFET. Use the datasheet's **144 °C/W** figure for the minimum recommended pad layout.

**Formula: temperature rise**

\[
\Delta T=P\,R_{\theta JA}
\]

Where:
- `ΔT` = junction temperature rise above ambient, in °C
- `P` = MOSFET power dissipation, in watts (W)
- `R_θJA` = junction-to-ambient thermal resistance, in °C/W

**Substitute**

\[
\Delta T=(0.112\ \mathrm W)(144\ ^\circ\mathrm C/\mathrm W)
=\boxed{16.1\ ^\circ\mathrm C}
\]

**Formula: junction temperature**

\[
T_J=T_A+\Delta T
\]

Where:
- `T_J` = estimated MOSFET junction temperature, in °C
- `T_A` = ambient temperature, in °C
- `ΔT` = calculated temperature rise, in °C

**Substitute**

\[
T_J=25\ ^\circ\mathrm C+16.1\ ^\circ\mathrm C
=\boxed{41.1\ ^\circ\mathrm C}
\]

With the **larger copper layout (97 °C/W)**, the temperature rise is only **10.9 °C**, giving approximately **35.9 °C** junction temperature at 25 °C ambient.

These estimates use room-temperature on-resistance and conduction loss; real resistance rises with junction temperature. For a 2 A load, the calculated heat is modest either way.

## 9. Final design and formula cheat sheet

### Circuit connections

```text
                   +12 V
                     |
                  [ LOAD ]
                   2 A |
                     |
                  D  |
               +-----+
MCU GPIO ---270Ω--- G   DMN3023L-7
               |  +-- S
              10kΩ    |
               |      |
              GND---- GND

MCU GND and 12 V supply GND must be connected.
```

### Selected parts and results

| Item | Selection / result |
|---|---:|
| MOSFET | DMN3023L-7 |
| MCU drive | 5 V |
| Series gate resistor | **270 Ω** |
| Gate-to-source pulldown | **10 kΩ** |
| Approx. initial peak gate current | **18.5 mA** |
| Illustrative gate-charge time target | **1 µs** |
| Gate-charge average current for that target | **8.3 mA** |
| Load | **12 V, 2 A** |
| On-state MOSFET voltage drop | **56 mV** |
| MOSFET conduction loss | **112 mW** |
| Junction rise, minimum pads | **16.1 °C** |
| Junction temp at 25 °C ambient, minimum pads | **41.1 °C** |
| Junction rise, larger copper | **10.9 °C** |

### Formula reference

| What you need | Formula |
|---|---|
| Average gate-charge current | `I_G,avg = Q_g / t` |
| Gate resistor | `R_G = V_GPIO / I_G,peak` |
| Initial peak gate current | `I_G,peak ≈ V_GPIO / R_G` |
| On-state voltage drop | `V_DS(on) = I_D × R_DS(on)` |
| Conduction loss | `P_cond = I_D² × R_DS(on)` |
| Junction temperature rise | `ΔT = P × R_θJA` |
| Junction temperature | `T_J = T_A + ΔT` |

**Bottom line:** A **270 Ω series gate resistor** and **10 kΩ pulldown** are straightforward choices for a 5 V MCU controlling this MOSFET at 2 A. The estimated on-state dissipation is **112 mW**, producing roughly **16 °C** junction rise on the minimum-pad PCB layout.

---

*Datasheet source: [DMN3023L, Diodes Incorporated](https://www.diodes.com/assets/Datasheets/DMN3023L.pdf). Values and calculations are a practical worked design example.*
