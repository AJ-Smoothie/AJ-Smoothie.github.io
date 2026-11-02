# MOSFET Gate Drive — Practical Design Reference

## Worked example: DMN3023L-7 + STM32 + RGB LED strip

**Design assumptions**

| Parameter | Value |
|---|---|
| MOSFET | DMN3023L-7, N-channel |
| MCU output voltage | 3.3 V |
| Assumed maximum GPIO source/sink current | 25 mA **(verify for exact STM32 pin/device)** |
| MOSFET total gate charge, Qg | 8.3 nC at VGS = 4.5 V (given datasheet figure) |
| Load | 2 A LED channel (illustrative) |
| PWM frequency | 1 kHz |
| Desired switching transition | ~1 µs (design target, not required by 1 kHz PWM) |
| Candidate series gate resistor | 180 Ω |
| Gate-to-source pulldown | 10 kΩ |

> **Important:** 25 mA is treated here as a *hard upper bound supplied for this example*, not as a recommended continuous GPIO operating current. Confirm the exact STM32 datasheet's output-current limits, voltage drop at the intended current, and total port/device current limits. A resistor calculated from the absolute maximum is not automatically a safe design.

## 1. Why a MOSFET gate needs current

A MOSFET gate is primarily a **capacitive load**. It draws transient current while switching, but essentially no steady-state DC gate current (apart from leakage). A series resistor limits the initial charging/discharging current and moderates ringing and EMI.

## 2. Gate charge and desired switching time

Average charging current, approximated from total gate charge:

\[
I_{G,avg} \approx \frac{Q_g}{t_{charge}}
\]

Using the quoted **8.3 nC** at **4.5 V** as a conservative illustrative charge estimate for the **3.3 V** drive:

\[
I_{G,avg} \approx \frac{8.3\ \mathrm{nC}}{1\ \mathrm{\mu s}} = 8.3\ \mathrm{mA}
\]

**Interpretation:** An average of about 8.3 mA would transfer 8.3 nC in 1 µs. This does **not** imply the actual gate waveform switches in exactly 1 µs: the current varies with gate voltage, the Miller plateau, MCU output resistance, and the load. Also, Qg at 3.3 V is not exactly the specified Qg at 4.5 V.

For the same assumed Qg:

| Assumed charging time | Required average gate current |
|---|---:|
| 10 µs | 0.83 mA |
| 5 µs | 1.66 mA |
| 2 µs | 4.15 mA |
| 1 µs | 8.3 mA |
| 0.5 µs | 16.6 mA |

## 3. Select the series gate resistor from peak GPIO current

At the instant a fully discharged gate starts charging, a simple **upper-bound approximation** is:

\[
I_{G,peak} \approx \frac{V_{GPIO}}{R_G}
\]

This neglects the MCU's output resistance, which typically *reduces* peak current.

Using 3.3 V and an intentionally chosen **20 mA** peak target (below the assumed 25 mA maximum):

\[
R_G \gtrsim \frac{3.3\ \mathrm{V}}{0.020\ \mathrm{A}} = 165\ \Omega
\]

Choose a standard **180 Ω** series resistor:

\[
I_{G,peak} \lesssim \frac{3.3}{180} = 0.0183\ \mathrm{A} = 18.3\ \mathrm{mA}
\]

The *mathematical minimum* based only on a 25 mA peak ceiling is:

\[
R_{G,min} = \frac{3.3}{0.025} = 132\ \Omega
\]

But **do not design right up to the maximum**. A 180–220 Ω resistor is a practical starting point if the exact MCU's GPIO specifications permit it.

| Series gate resistor | Idealized initial peak current at 3.3 V |
|---|---:|
| 100 Ω | 33 mA — exceeds assumed 25 mA ceiling |
| 150 Ω | 22 mA |
| **180 Ω** | **18.3 mA** |
| 220 Ω | 15 mA |
| 330 Ω | 10 mA |
| 1 kΩ | 3.3 mA |
| 10 kΩ | 0.33 mA — potentially slow for PWM |

**Note:** These are *initial peak currents*, not average currents over a PWM cycle. Both rising and falling gate transitions matter: check the GPIO's **source and sink** capability.

## 4. PWM frequency versus switching speed

PWM period:

\[
T = \frac{1}{f_{PWM}}
\]

For 1 kHz:

\[
T = \frac{1}{1000\ \mathrm{Hz}} = 1\ \mathrm{ms} = 1000\ \mathrm{\mu s}
\]

If the MOSFET spends 1 µs turning on and 1 µs turning off, the **total transition-time fraction** of each cycle is:

\[
\frac{t_{on}+t_{off}}{T} = \frac{1+1}{1000} = 0.002 = 0.2\%
\]

This is why microsecond-scale switching is often sufficient for a low-frequency LED PWM circuit. **A 1 kHz PWM frequency does not mandate 1 µs switching.** PWM frequency affects visible flicker, camera banding, and dimming behavior; MOSFET switching time primarily affects transition losses and waveform fidelity, especially at extreme duty cycles.

## 5. Approximate switching loss

For a low-side switch with approximately linear current/voltage overlap during transitions:

\[
P_{switch} \approx \frac{1}{2} V_{DS} I_D (t_{on}+t_{off}) f_{PWM}
\]

**Example only:** 12 V LED strip, 2 A, 1 µs turn-on, 1 µs turn-off, 1 kHz:

\[
P_{switch} \approx \tfrac{1}{2}(12)(2)(2\times10^{-6})(1000)
= 0.024\ \mathrm{W} = 24\ \mathrm{mW}
\]

This is a rough estimate, not a guaranteed loss figure; real switching waveforms and LED-strip behavior matter.

## 6. MOSFET on-state conduction loss

\[
V_{drop} = I_D R_{DS(on)}
\]

\[
P_{conduction} = I_D^2 R_{DS(on)}
\]

For **2 A** and an **assumed** 30–35 mΩ on-resistance at **3.3 V** gate drive:

\[
V_{drop} \approx (2)(0.030\text{ to }0.035) = 0.060\text{ to }0.070\ \mathrm{V}
\]

\[
P_{conduction} \approx (2)^2(0.030\text{ to }0.035) = 0.120\text{ to }0.140\ \mathrm{W}
\]

At 100% PWM duty, that is approximately **120–140 mW** of conduction loss, *if the assumed resistance holds*. At lower duty cycle, average conduction loss decreases approximately in proportion to duty cycle (for fixed on-current).

**Critical caveat:** The DMN3023L-7's RDS(on) is **not guaranteed at VGS = 3.3 V** by a 4.5 V or 2.5 V specification alone. Use the datasheet's actual guaranteed test conditions and allow for temperature increase. These are **design estimates**, not worst-case bounds.

## 7. Average gate-drive current and MCU power

Each PWM cycle charges and then discharges the gate. The approximate **average charge drawn from the GPIO supply** is:

\[
I_{supply,avg} \approx Q_g f_{PWM}
\]

Using 8.3 nC and 1 kHz:

\[
I_{supply,avg} \approx (8.3\times10^{-9})(1000)
= 8.3\ \mathrm{\mu A}
\]

Approximate total gate-drive energy dissipated per second across the driver/gate resistance:

\[
P_{gate-drive} \approx Q_g V_{GPIO} f_{PWM}
\]

\[
P_{gate-drive} \approx (8.3\times10^{-9})(3.3)(1000)
= 27.4\ \mathrm{\mu W}
\]

These values are illustrative because Qg was specified at 4.5 V, not 3.3 V. **Microamp average supply current does not eliminate the need to respect milliamp-scale transient GPIO current limits.**

## 8. Practical RGB LED wiring

For a conventional **common-anode, constant-voltage RGB LED strip** (not addressable LEDs), use one N-channel MOSFET per color:

```text
                  +12 V (or rated LED supply)
                    |
           RGB strip common +
                    |
        +-----------+-----------+
        |           |           |
     R channel   G channel   B channel
        |           |           |
       D Q1        D Q2        D Q3
       S |         S |         S |
        +-----------+-----------+---- GND

STM32 PWM_R --- 180 Ω --- Gate Q1
STM32 PWM_G --- 180 Ω --- Gate Q2
STM32 PWM_B --- 180 Ω --- Gate Q3

Each gate --- 10 kΩ --- GND  (pulldown)
STM32 GND ---------------- LED supply GND
```

The MOSFET switches the **negative side** of each channel; the LED strip's common positive connects to the strip's rated supply. Do not connect the LED strip directly to the MCU pin. Verify the strip has its intended current-limiting components.

**Pulldown purpose:** 10 kΩ from gate to source/GND keeps the MOSFET off while the STM32 pin is floating during boot/reset. This **is not** the 180 Ω series resistor. With the GPIO high, the 10 kΩ pulldown draws approximately 3.3 V / 10 kΩ = **0.33 mA**, so it also slightly loads the pin.

## 9. Quick formula sheet

| What you want | Formula |
|---|---|
| PWM period | `T = 1 / f_PWM` |
| Average gate charging current | `I_G,avg ≈ Qg / t_charge` |
| Approx. initial gate current | `I_G,peak ≈ V_GPIO / R_G` |
| Minimum resistor for a chosen peak limit | `R_G ≥ V_GPIO / I_peak_limit` |
| Gate-drive average supply current | `I_supply,avg ≈ Qg × f_PWM` |
| Gate-drive power | `P_gate ≈ Qg × V_GPIO × f_PWM` |
| MOSFET on-state voltage drop | `V_drop = I_D × R_DS(on)` |
| MOSFET conduction loss | `P_cond = I_D² × R_DS(on)` |
| Approximate switching loss | `P_sw ≈ ½ × V_DS × I_D × (t_on + t_off) × f_PWM` |
| Thermal rise estimate | `ΔT ≈ P_total × RθJA` (board/layout-dependent) |

## 10. Practical starting choice

For this **DMN3023L-7 / 3.3 V STM32 / 1 kHz RGB LED PWM** example:

- **180 Ω series gate resistor** per MOSFET (about **18.3 mA ideal initial peak**).
- **10 kΩ gate-to-source pulldown** per MOSFET.
- **1 kHz PWM** as an initial frequency.
- **2 A/channel** worked example: approximately **0.12–0.14 W** conduction loss *if* RDS(on) is 30–35 mΩ at the actual operating point.
- **Check** the exact STM32 GPIO source/sink ratings, MOSFET thermal limits/package, and actual 3.3 V gate performance. Measure gate rise/fall and MOSFET temperature on the prototype if needed.

**Takeaway:** Gate charge tells you roughly how much current you need for a desired switching time; the GPIO limit tells you how much peak current you can safely request; the gate resistor connects those two constraints.
