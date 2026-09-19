import * as THREE from 'three';
import type { MonumentId, CreatureId } from '../types';

export type LightingMode = 'dawn' | 'noon' | 'aarti' | 'night';

export interface ModelBuildOptions {
  wireframe?: boolean;
  reconstructionMode?: boolean; // true = golden age pristine, false = weathered stone
  opacity?: number;
}

/**
 * Creates rich, accurate procedural 3D meshes for Indian monuments and creatures.
 */
export class ProceduralModelBuilder {
  /**
   * Helper to create stone/marble materials with bump and specular nuances
   */
  private static getMaterial(
    color: number,
    opts: ModelBuildOptions = {},
    emissive = 0x000000
  ): THREE.Material {
    if (opts.wireframe) {
      return new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        wireframe: true,
        transparent: true,
        opacity: opts.opacity ?? 0.75,
      });
    }

    return new THREE.MeshStandardMaterial({
      color,
      roughness: opts.reconstructionMode ? 0.25 : 0.65,
      metalness: opts.reconstructionMode ? 0.35 : 0.1,
      emissive,
      emissiveIntensity: opts.reconstructionMode ? 0.15 : 0.05,
      transparent: opts.opacity !== undefined && opts.opacity < 1.0,
      opacity: opts.opacity ?? 1.0,
    });
  }

  private static getGoldMaterial(opts: ModelBuildOptions = {}): THREE.Material {
    if (opts.wireframe) {
      return new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true });
    }
    return new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x443000,
    });
  }

  // ==========================================
  // MONUMENT BUILDERS
  // ==========================================

  public static buildTajMahal(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'TajMahal';

    const marbleColor = opts.reconstructionMode ? 0xffffff : 0xf1efe7;
    const marbleMat = this.getMaterial(marbleColor, opts);
    const goldMat = this.getGoldMaterial(opts);
    const redSandstoneMat = this.getMaterial(0xa34431, opts);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7,
    });

    // 1. Red Sandstone Quadrangle Plinth
    const basePlinth = new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 7), redSandstoneMat);
    basePlinth.position.y = 0.2;
    group.add(basePlinth);

    // Reflecting Pool
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 3.5), waterMat);
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(0, 0.41, 2.8);
    group.add(pool);

    // 2. White Marble Terrace
    const marblePlinth = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 4.6), marbleMat);
    marblePlinth.position.y = 0.65;
    group.add(marblePlinth);

    // 3. Central Octagonal Mausoleum Body
    const bodyGeo = new THREE.CylinderGeometry(1.6, 1.7, 1.8, 8);
    const body = new THREE.Mesh(bodyGeo, marbleMat);
    body.position.y = 1.8;
    group.add(body);

    // Grand arched Iwans (cutouts simulated via decorative recessed arches)
    for (let i = 0; i < 4; i++) {
      const arch = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.3), this.getMaterial(0x2a2830, opts));
      arch.position.y = 1.8;
      arch.rotation.y = (i * Math.PI) / 2;
      arch.translateZ(1.6);
      group.add(arch);
    }

    // 4. Onion Dome Drum & Bulbous Dome
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.6, 24), marbleMat);
    drum.position.y = 3.0;
    group.add(drum);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.7), marbleMat);
    dome.scale.set(1.0, 1.35, 1.0);
    dome.position.y = 3.2;
    group.add(dome);

    // Gilded Finial (Kalasha)
    const finial = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.8, 16), goldMat);
    finial.position.y = 4.8;
    group.add(finial);

    // 4 Corner Chhatris (Kiosks)
    const chhatriOffsets = [
      [-0.9, -0.9],
      [0.9, -0.9],
      [-0.9, 0.9],
      [0.9, 0.9],
    ];
    chhatriOffsets.forEach(([cx, cz]) => {
      const chhatriDome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), marbleMat);
      chhatriDome.position.set(cx, 3.1, cz);
      group.add(chhatriDome);

      const chhatriFinial = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.25, 8), goldMat);
      chhatriFinial.position.set(cx, 3.4, cz);
      group.add(chhatriFinial);
    });

    // 5. Four Outward-Tilted Minarets
    const minaretOffsets = [
      [-2.1, -2.1, -0.02, -0.02],
      [2.1, -2.1, 0.02, -0.02],
      [-2.1, 2.1, -0.02, 0.02],
      [2.1, 2.1, 0.02, 0.02],
    ];

    minaretOffsets.forEach(([mx, mz, rx, rz]) => {
      const minaretGroup = new THREE.Group();
      minaretGroup.position.set(mx, 0.9, mz);
      minaretGroup.rotation.x = rx;
      minaretGroup.rotation.z = rz;

      // Shaft tapering upwards
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 3.2, 16), marbleMat);
      shaft.position.y = 1.6;
      minaretGroup.add(shaft);

      // Balcony Rings
      [1.0, 2.1, 3.2].forEach((by) => {
        const balcony = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.1, 16), marbleMat);
        balcony.position.y = by;
        minaretGroup.add(balcony);
      });

      // Minaret Chhatri Dome
      const mCupola = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), marbleMat);
      mCupola.position.y = 3.45;
      minaretGroup.add(mCupola);

      const mFinial = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 8), goldMat);
      mFinial.position.y = 3.75;
      minaretGroup.add(mFinial);

      group.add(minaretGroup);
    });

    return group;
  }

  public static buildKonarkSun(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'KonarkSunTemple';

    const stoneColor = opts.reconstructionMode ? 0xc7925b : 0x73675a;
    const stoneMat = this.getMaterial(stoneColor, opts);
    const goldMat = this.getGoldMaterial(opts);

    // 1. High Chariot Plinth
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.8, 4.5), stoneMat);
    plinth.position.y = 0.4;
    group.add(plinth);

    // 2. 24 Chariot Wheels (12 on each side)
    const wheelMat = this.getMaterial(0x8a7761, opts);
    const wheelGeo = new THREE.TorusGeometry(0.55, 0.08, 12, 24);
    const hubGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 12);

    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 6; i++) {
        const wx = -2.5 + i * 1.0;
        const wz = side * 2.32;

        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(wx, 0.55, wz);

        const rim = new THREE.Mesh(wheelGeo, wheelMat);
        rim.rotation.y = side === 1 ? 0 : Math.PI;
        wheelGroup.add(rim);

        const hub = new THREE.Mesh(hubGeo, goldMat);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        // 8 Major Spokes
        for (let s = 0; s < 8; s++) {
          const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), wheelMat);
          spoke.rotation.z = (s * Math.PI) / 4;
          wheelGroup.add(spoke);
        }

        group.add(wheelGroup);
      }
    }

    // 3. Surviving Jagamohana (Audience Hall) - Stepped Pyramid (Pidha Deula)
    const jHall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.4, 3.0), stoneMat);
    jHall.position.y = 1.5;
    group.add(jHall);

    // 3 Diminishing Tiered Pothis
    const tier1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.5, 2.8), stoneMat);
    tier1.position.y = 2.45;
    group.add(tier1);

    const tier2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.5, 2.2), stoneMat);
    tier2.position.y = 2.95;
    group.add(tier2);

    const tier3 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), stoneMat);
    tier3.position.y = 3.4;
    group.add(tier3);

    // Bell-shaped Kalasha (Amalaka)
    const amalaka = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.8, 0.35, 20), stoneMat);
    amalaka.position.y = 3.75;
    group.add(amalaka);

    const kalashaFinial = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 16), goldMat);
    kalashaFinial.position.y = 4.15;
    group.add(kalashaFinial);

    // 4. Lost 229ft Rekha Deula (Tower) - Rendered in holographic gold wireframe or reconstructed mode
    const towerMat = opts.reconstructionMode
      ? this.getMaterial(0xd97706, opts)
      : new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true, transparent: true, opacity: 0.35 });

    const shikhara = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 2.0, 4.0, 16), towerMat);
    shikhara.position.set(-2.0, 3.2, 0);
    group.add(shikhara);

    const sAmalaka = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.4, 16), opts.reconstructionMode ? goldMat : towerMat);
    sAmalaka.position.set(-2.0, 5.3, 0);
    group.add(sAmalaka);

    // 5. 7 Draught Horses at the East Front
    for (let h = -3; h <= 3; h++) {
      const horse = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.8), stoneMat);
      horse.position.set(3.5, 0.5, h * 0.45);
      horse.rotation.y = Math.PI / 2;
      group.add(horse);
    }

    return group;
  }

  public static buildMeenakshiAmman(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'MeenakshiAmman';

    const baseStoneMat = this.getMaterial(0x475569, opts);
    const goldMat = this.getGoldMaterial(opts);

    // Dravidian Temple Courtyard Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 6.5), baseStoneMat);
    base.position.y = 0.2;
    group.add(base);

    // Central Sacred Lotus Pond (Porthamarai Kulam)
    const pond = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 2.0), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 }));
    pond.position.set(-0.8, 0.42, -0.8);
    group.add(pond);

    // Golden Lotus in the pond
    const goldenLotus = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.05, 0.2, 12), goldMat);
    goldenLotus.position.set(-0.8, 0.55, -0.8);
    group.add(goldenLotus);

    // Thousand Pillar Hall Colonnade
    const pillarMat = this.getMaterial(0x64748b, opts);
    for (let px = -2.2; px <= -1.2; px += 0.4) {
      for (let pz = 0.5; pz <= 2.2; pz += 0.4) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8), pillarMat);
        pillar.position.set(px, 1.0, pz);
        group.add(pillar);
      }
    }

    // Four Soaring Polychromatic Gopurams (East, West, North, South)
    const gopuramPositions: [number, number, number][] = [
      [0, 0, 2.6],   // South (Tallest)
      [0, 0, -2.6],  // North
      [2.6, 0, 0],   // East
      [-2.6, 0, 0],  // West
    ];

    gopuramPositions.forEach(([gx, gy, gz], idx) => {
      const gopuramGroup = new THREE.Group();
      gopuramGroup.position.set(gx, gy + 0.4, gz);
      if (gx !== 0) gopuramGroup.rotation.y = Math.PI / 2;

      // Gateway portal opening
      const gateBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.1), baseStoneMat);
      gateBase.position.y = 0.5;
      gopuramGroup.add(gateBase);

      // 7 Tiers of Polychromatic Sculptures
      const tierCount = idx === 0 ? 9 : 7;
      for (let t = 0; t < tierCount; t++) {
        const progress = t / tierCount;
        const width = 1.5 * (1 - progress * 0.45);
        const depth = 1.0 * (1 - progress * 0.45);
        const tierHeight = 0.38;

        // In golden age / festival mode: bright temple colors; else weathered granite
        const tierColor = opts.reconstructionMode
          ? [0xef4444, 0xf59e0b, 0x10b981, 0x3b82f6, 0xec4899][t % 5]
          : 0x94a3b8;

        const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(width, tierHeight, depth), this.getMaterial(tierColor, opts));
        tierMesh.position.y = 1.0 + t * tierHeight;
        gopuramGroup.add(tierMesh);
      }

      // Barrel-Vaulted Sala Roof Crest with 9 Kalashas
      const topY = 1.0 + tierCount * 0.38;
      const salaRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.8, 12), this.getMaterial(0xd97706, opts));
      salaRoof.rotation.z = Math.PI / 2;
      salaRoof.position.y = topY + 0.2;
      gopuramGroup.add(salaRoof);

      // Golden Finials (Kalashas)
      for (let k = -0.3; k <= 0.3; k += 0.15) {
        const kMesh = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.18, 8), goldMat);
        kMesh.position.set(k, topY + 0.45, 0);
        gopuramGroup.add(kMesh);
      }

      group.add(gopuramGroup);
    });

    // Central Golden Vimana (Sanctum)
    const vimana = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.6, 4), goldMat);
    vimana.position.set(0.6, 1.4, 0.6);
    group.add(vimana);

    return group;
  }

  public static buildKailasaEllora(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'KailasaEllora';

    const basaltColor = opts.reconstructionMode ? 0xf8fafc : 0x475569; // Pristine white snow-plaster or dark basalt
    const rockMat = this.getMaterial(basaltColor, opts);
    const canyonMat = this.getMaterial(0x334155, opts);

    // 1. Monolithic Excavated Canyon Walls
    const cliffNorth = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.5, 0.8), canyonMat);
    cliffNorth.position.set(0, 1.75, -2.6);
    group.add(cliffNorth);

    const cliffEast = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.5, 5.2), canyonMat);
    cliffEast.position.set(-2.8, 1.75, 0);
    group.add(cliffEast);

    const cliffSouth = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.5, 0.8), canyonMat);
    cliffSouth.position.set(0, 1.75, 2.6);
    group.add(cliffSouth);

    // Canyon Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.2, 5.0), canyonMat);
    floor.position.y = 0.1;
    group.add(floor);

    // 2. High Monolithic Elephant Plinth (Gajathara)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.8, 3.4), rockMat);
    plinth.position.set(0.4, 0.5, 0);
    group.add(plinth);

    // Carved Elephants supporting the base
    for (let ex = -0.8; ex <= 1.6; ex += 0.8) {
      for (let ez = -1.5; ez <= 1.5; ez += 3.0) {
        const elephant = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.5), this.getMaterial(0x64748b, opts));
        elephant.position.set(ex, 0.35, ez);
        group.add(elephant);
      }
    }

    // 3. Main Multi-Storey Dravidian Shikhara
    const mainVimana = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 2.2), rockMat);
    mainVimana.position.set(0.4, 1.5, 0);
    group.add(mainVimana);

    const pyramidSpire = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.0, 4), rockMat);
    pyramidSpire.position.set(0.4, 2.8, 0);
    pyramidSpire.rotation.y = Math.PI / 4;
    group.add(pyramidSpire);

    const apexCupola = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), rockMat);
    apexCupola.position.set(0.4, 3.9, 0);
    group.add(apexCupola);

    // 4. Two Monolithic Victory Flagstaffs (Dhwaja-Stambhas - 15m)
    [-1.2, 1.2].forEach((fz) => {
      const stambha = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 3.2, 16), rockMat);
      stambha.position.set(-1.4, 1.6, fz);
      group.add(stambha);

      const trident = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 8), this.getGoldMaterial(opts));
      trident.position.set(-1.4, 3.35, fz);
      group.add(trident);
    });

    // 5. Nandi Mandapa Pavilion
    const nandiPavilion = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.4, 1.1), rockMat);
    nandiPavilion.position.set(-1.4, 0.8, 0);
    group.add(nandiPavilion);

    return group;
  }

  public static buildHawaMahal(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'HawaMahal';

    const pinkColor = opts.reconstructionMode ? 0xf43f5e : 0xe06d53;
    const stoneMat = this.getMaterial(pinkColor, opts);
    const whiteLatticeMat = this.getMaterial(0xfef2f2, opts);
    const goldMat = this.getGoldMaterial(opts);

    // Foundation Podium
    const base = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 1.8), stoneMat);
    base.position.y = 0.2;
    group.add(base);

    // 5 Stepped Pyramidal Tiers (Width reduces with height)
    const tiers = [
      { w: 5.0, h: 0.9, y: 0.85, bays: 7 },
      { w: 4.4, h: 0.85, y: 1.7, bays: 6 },
      { w: 3.6, h: 0.8, y: 2.5, bays: 5 },
      { w: 2.6, h: 0.75, y: 3.25, bays: 3 },
      { w: 1.4, h: 0.7, y: 3.95, bays: 1 }, // Hawa Mandir
    ];

    tiers.forEach((tier) => {
      const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(tier.w, tier.h, 0.5), stoneMat);
      tierMesh.position.set(0, tier.y, 0);
      group.add(tierMesh);

      // Curved Bay Jharokhas protruding forward
      const step = tier.w / (tier.bays + 1);
      for (let b = 1; b <= tier.bays; b++) {
        const bx = -tier.w / 2 + b * step;
        const jharokha = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, tier.h * 0.75, 12, 1, false, 0, Math.PI), whiteLatticeMat);
        jharokha.rotation.y = -Math.PI / 2;
        jharokha.position.set(bx, tier.y, 0.32);
        group.add(jharokha);

        // Miniature fluted dome roof over jharokha
        const jDome = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), stoneMat);
        jDome.position.set(bx, tier.y + tier.h * 0.4, 0.32);
        group.add(jDome);
      }
    });

    // Crown Finial on top (Krishna Crown Silhouette)
    const crownFinial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 12), goldMat);
    crownFinial.position.set(0, 4.6, 0);
    group.add(crownFinial);

    return group;
  }

  public static buildHampiChariot(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'HampiStoneChariot';

    const graniteColor = opts.reconstructionMode ? 0xd97706 : 0x78716c;
    const graniteMat = this.getMaterial(graniteColor, opts);
    const goldMat = this.getGoldMaterial(opts);

    // Granite Platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 3.4), graniteMat);
    platform.position.y = 0.2;
    group.add(platform);

    // 4 Free-Rotating Axis Granite Wheels
    const wheelOffsets: [number, number][] = [
      [-1.3, -1.5],
      [1.3, -1.5],
      [-1.3, 1.5],
      [1.3, 1.5],
    ];

    wheelOffsets.forEach(([wx, wz]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.65, wz);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 24), graniteMat);
      wheelGroup.add(rim);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.25, 16), goldMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      // Lotus Petal Carved Spokes
      for (let s = 0; s < 8; s++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), graniteMat);
        spoke.rotation.z = (s * Math.PI) / 4;
        wheelGroup.add(spoke);
      }

      group.add(wheelGroup);
    });

    // Chariot Carriage Body (Shrine to Garuda)
    const wagonBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 2.0), graniteMat);
    wagonBody.position.y = 1.3;
    group.add(wagonBody);

    // Cornices & Carved Mouldings
    const cornice = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.2, 2.3), graniteMat);
    cornice.position.y = 2.05;
    group.add(cornice);

    // Stepped Dravidian Pyramid Roof
    const roof1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 1.8), graniteMat);
    roof1.position.y = 2.35;
    group.add(roof1);

    const roof2 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.2), graniteMat);
    roof2.position.y = 2.7;
    group.add(roof2);

    // Stupi Finial
    const stupi = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 12), goldMat);
    stupi.position.y = 3.1;
    group.add(stupi);

    // Two Monolithic Elephants guarding the front ladder
    [-0.5, 0.5].forEach((ez) => {
      const elephant = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.4), graniteMat);
      elephant.position.set(1.5, 0.5, ez);
      group.add(elephant);
    });

    return group;
  }

  public static buildQutubMinar(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'QutubMinar';

    const redSandstoneMat = this.getMaterial(0xb91c1c, opts);
    const marbleMat = this.getMaterial(0xf8fafc, opts);

    // Foundation Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.4, 24), redSandstoneMat);
    base.position.y = 0.2;
    group.add(base);

    // 5 Tiers with Fluting & Muqarnas Balconies
    const tiers = [
      { rTop: 1.4, rBot: 1.8, h: 1.5, y: 1.15, mat: redSandstoneMat }, // Angular & circular flutes
      { rTop: 1.1, rBot: 1.4, h: 1.3, y: 2.55, mat: redSandstoneMat }, // Circular flutes
      { rTop: 0.85, rBot: 1.1, h: 1.1, y: 3.75, mat: redSandstoneMat }, // Angular flutes
      { rTop: 0.65, rBot: 0.85, h: 0.9, y: 4.75, mat: marbleMat },     // White marble Tughlaq
      { rTop: 0.45, rBot: 0.65, h: 0.8, y: 5.6, mat: marbleMat },      // Top storey
    ];

    tiers.forEach((t) => {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(t.rTop, t.rBot, t.h, 24), t.mat);
      shaft.position.y = t.y;
      group.add(shaft);

      // Projecting Balcony Ring with Honeycomb Brackets
      const balcony = new THREE.Mesh(new THREE.CylinderGeometry(t.rBot * 1.15, t.rBot * 0.95, 0.16, 24), redSandstoneMat);
      balcony.position.y = t.y - t.h / 2;
      group.add(balcony);
    });

    // Spire Finial
    const finial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 12), redSandstoneMat);
    finial.position.y = 6.25;
    group.add(finial);

    // The Rust-Free Iron Pillar of Delhi nearby
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 });
    const ironPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 2.2, 16), ironMat);
    ironPillar.position.set(2.4, 1.1, 1.2);
    group.add(ironPillar);

    const ironCapital = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.1, 0.3, 12), ironMat);
    ironCapital.position.set(2.4, 2.3, 1.2);
    group.add(ironCapital);

    return group;
  }

  public static buildBrihadisvara(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Brihadisvara';

    const graniteColor = opts.reconstructionMode ? 0xd97706 : 0x7c6e5e;
    const stoneMat = this.getMaterial(graniteColor, opts);
    const goldMat = this.getGoldMaterial(opts);

    // Vast Granite Quadrangle
    const base = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.4, 5.0), stoneMat);
    base.position.y = 0.2;
    group.add(base);

    // Garbhagriha Sanctum Base (Upapitha)
    const sanctumBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 3.2), stoneMat);
    sanctumBase.position.set(-0.8, 0.9, 0);
    group.add(sanctumBase);

    // Soaring 16-Tiered Diminishing Granite Vimana (66m)
    const tierCount = 10;
    for (let t = 0; t < tierCount; t++) {
      const progress = t / tierCount;
      const size = 2.8 * (1 - progress * 0.72);
      const tierMesh = new THREE.Mesh(new THREE.BoxGeometry(size, 0.32, size), stoneMat);
      tierMesh.position.set(-0.8, 1.6 + t * 0.32, 0);
      group.add(tierMesh);
    }

    // 80-Tonne Monolithic Granite Capstone (Kumbam)
    const topY = 1.6 + tierCount * 0.32;
    const kumbam = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 12), stoneMat);
    kumbam.scale.set(1.0, 0.75, 1.0);
    kumbam.position.set(-0.8, topY + 0.4, 0);
    group.add(kumbam);

    // Gilded Copper Stupi Finial
    const stupi = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 16), goldMat);
    stupi.position.set(-0.8, topY + 0.9, 0);
    group.add(stupi);

    // Colossal Monolithic Nandi Bull Pavilion in front
    const nandiPavilion = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.2), stoneMat);
    nandiPavilion.position.set(1.8, 0.45, 0);
    group.add(nandiPavilion);

    const blackStoneMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.2 });
    const nandiBull = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.45), blackStoneMat);
    nandiBull.position.set(1.8, 0.8, 0);
    group.add(nandiBull);

    return group;
  }

  // ==========================================
  // SACRED CREATURE BUILDERS
  // ==========================================

  public static buildCreature(creatureId: CreatureId, opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = `Creature_${creatureId}`;

    const goldMat = this.getGoldMaterial(opts);

    switch (creatureId) {
      case 'yali': {
        // Lion body + Elephant trunk + Horns + Serpent tail
        const yaliMat = this.getMaterial(0xf59e0b, opts);

        // Muscular torso rearing upwards
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.65, 1.8, 16), yaliMat);
        torso.position.y = 1.2;
        torso.rotation.z = -0.2;
        group.add(torso);

        // Lion head with flared fangs
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), yaliMat);
        head.position.set(0.3, 2.2, 0);
        group.add(head);

        // Curved Elephant Trunk
        const trunkCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.6, 2.1, 0),
          new THREE.Vector3(0.9, 1.9, 0),
          new THREE.Vector3(1.1, 2.3, 0),
          new THREE.Vector3(1.3, 2.5, 0),
        ]);
        const trunkGeo = new THREE.TubeGeometry(trunkCurve, 20, 0.12, 12, false);
        const trunk = new THREE.Mesh(trunkGeo, yaliMat);
        group.add(trunk);

        // Rolling stone ball inside open fangs
        const stoneBall = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), goldMat);
        stoneBall.position.set(0.7, 2.05, 0);
        group.add(stoneBall);

        // Spiraling horns
        [-0.2, 0.2].forEach((hz) => {
          const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 12), goldMat);
          horn.position.set(0.2, 2.7, hz);
          horn.rotation.z = -0.4;
          group.add(horn);
        });

        // Serpent tail curling upwards
        const tailCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.3, 0.6, 0),
          new THREE.Vector3(-0.8, 1.2, 0),
          new THREE.Vector3(-0.6, 1.8, 0),
        ]);
        const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 16, 0.08, 8, false), yaliMat);
        group.add(tail);

        break;
      }

      case 'makara': {
        // Sea beast: crocodile jaws, peacock plumage tail
        const makaraMat = this.getMaterial(0x06b6d4, opts);

        // Serpentine arched torso
        const bodyCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.4, 0.8, 0),
          new THREE.Vector3(0.6, 1.4, 0),
          new THREE.Vector3(-0.5, 1.2, 0),
          new THREE.Vector3(-1.3, 1.8, 0),
        ]);
        const body = new THREE.Mesh(new THREE.TubeGeometry(bodyCurve, 24, 0.45, 16, false), makaraMat);
        group.add(body);

        // Crocodile gaping snout
        const snout = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 12), makaraMat);
        snout.rotation.z = -Math.PI / 2;
        snout.position.set(1.9, 0.8, 0);
        group.add(snout);

        // Water Spout (Pranala) Holy Stream
        const streamMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
        const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.25, 1.2, 12), streamMat);
        stream.position.set(2.4, 0.3, 0);
        group.add(stream);

        // Flamboyant Peacock Spiraling Feather Tail
        for (let i = 0; i < 5; i++) {
          const feather = new THREE.Mesh(new THREE.TorusGeometry(0.4 - i * 0.05, 0.06, 8, 16), goldMat);
          feather.position.set(-1.4 - i * 0.15, 1.9 + i * 0.1, 0);
          feather.rotation.y = (i * Math.PI) / 8;
          group.add(feather);
        }

        break;
      }

      case 'airavata': {
        // Multi-tusked white celestial elephant
        const elephantMat = this.getMaterial(0xf8fafc, opts);

        // Massive Elephant Torso
        const body = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 20), elephantMat);
        body.scale.set(1.3, 1.0, 0.9);
        body.position.y = 1.6;
        group.add(body);

        // Stately Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 20), elephantMat);
        head.position.set(1.4, 2.0, 0);
        group.add(head);

        // Large Flapping Ears
        [-0.6, 0.6].forEach((ez) => {
          const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 16), elephantMat);
          ear.position.set(1.3, 2.1, ez);
          ear.rotation.x = Math.PI / 2;
          group.add(ear);
        });

        // Raised Greeting Trunk
        const trunkCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(1.8, 1.9, 0),
          new THREE.Vector3(2.3, 1.5, 0),
          new THREE.Vector3(2.5, 2.4, 0),
          new THREE.Vector3(2.3, 2.8, 0),
        ]);
        const trunk = new THREE.Mesh(new THREE.TubeGeometry(trunkCurve, 20, 0.16, 12, false), elephantMat);
        group.add(trunk);

        // Four Celestial Golden Tusks
        const tuskPositions: [number, number, number, number][] = [
          [1.8, 1.7, 0.25, 0.2],
          [1.8, 1.7, -0.25, -0.2],
          [1.9, 1.45, 0.35, 0.3],
          [1.9, 1.45, -0.35, -0.3],
        ];
        tuskPositions.forEach(([tx, ty, tz, rz]) => {
          const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.9, 12), goldMat);
          tusk.position.set(tx, ty, tz);
          tusk.rotation.z = -Math.PI / 3;
          tusk.rotation.y = rz;
          group.add(tusk);
        });

        // Royal Howdah (Gilded Throne Saddle)
        const howdah = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.8), goldMat);
        howdah.position.set(0.1, 2.7, 0);
        group.add(howdah);

        // 4 Pillar Legs
        const legOffsets = [
          [-0.6, -0.5],
          [-0.6, 0.5],
          [0.6, -0.5],
          [0.6, 0.5],
        ];
        legOffsets.forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 1.2, 16), elephantMat);
          leg.position.set(lx, 0.6, lz);
          group.add(leg);
        });

        break;
      }

      case 'garuda': {
        // Anthropomorphic bird: muscular torso, golden wings, sharp beak
        const garudaMat = this.getMaterial(0xec4899, opts);

        // Kneeling torso with hands in Anjali Mudra
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.4, 16), garudaMat);
        torso.position.y = 1.3;
        group.add(torso);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), garudaMat);
        head.position.set(0, 2.15, 0);
        group.add(head);

        // Predatory Golden Beak
        const beak = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 12), goldMat);
        beak.rotation.z = -Math.PI / 2;
        beak.position.set(0.4, 2.1, 0);
        group.add(beak);

        // Regal Crown (Kirita Mukuta)
        const crown = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.6, 12), goldMat);
        crown.position.set(0, 2.65, 0);
        group.add(crown);

        // Outspread Golden Wings
        [-1, 1].forEach((side) => {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.08), goldMat);
          wing.position.set(0, 1.6, side * 0.9);
          wing.rotation.y = side * 0.4;
          wing.rotation.x = side * 0.2;
          group.add(wing);
        });

        break;
      }

      case 'nandi': {
        // Recumbent sacred bull
        const nandiMat = this.getMaterial(0x1e293b, opts); // Black stone

        // Recumbent muscular body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.1), nandiMat);
        body.position.set(0, 0.55, 0);
        group.add(body);

        // Distinct Zebu Hump
        const hump = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), nandiMat);
        hump.position.set(-0.2, 1.1, 0);
        group.add(hump);

        // Noble Bull Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.5), nandiMat);
        head.position.set(1.0, 0.9, 0);
        group.add(head);

        // Curved Horns
        [-0.2, 0.2].forEach((hz) => {
          const horn = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.4, 12), goldMat);
          horn.position.set(1.0, 1.3, hz);
          horn.rotation.z = -0.3;
          horn.rotation.x = hz * 1.2;
          group.add(horn);
        });

        // Sacred Carved Bell Necklace (Ghanta Mala)
        const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.08, 8, 16), goldMat);
        necklace.position.set(0.6, 0.75, 0);
        necklace.rotation.y = Math.PI / 2;
        group.add(necklace);

        break;
      }

      case 'sharaba': {
        // 8-legged winged chimera
        const beastMat = this.getMaterial(0x8b5cf6, opts);

        const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.8, 0.9), beastMat);
        body.position.set(0, 1.2, 0);
        group.add(body);

        // 8 Legs
        for (let side = -1; side <= 1; side += 2) {
          for (let l = 0; l < 4; l++) {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), beastMat);
            leg.position.set(-0.7 + l * 0.45, 0.5, side * 0.55);
            group.add(leg);
          }
        }

        // Two Bird Wings
        [-1, 1].forEach((wSide) => {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.06), goldMat);
          wing.position.set(0, 1.8, wSide * 0.8);
          wing.rotation.y = wSide * 0.3;
          group.add(wing);
        });

        break;
      }

      case 'mayura': {
        // Celestial Peacock with fan tail
        const peacockMat = this.getMaterial(0x0284c7, opts);

        // Graceful S-Curved Neck & Torso
        const neckCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0.8, 0),
          new THREE.Vector3(0.4, 1.4, 0),
          new THREE.Vector3(0.3, 2.0, 0),
        ]);
        const neck = new THREE.Mesh(new THREE.TubeGeometry(neckCurve, 16, 0.18, 12, false), peacockMat);
        group.add(neck);

        // Crown Crest
        const crest = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 8), goldMat);
        crest.position.set(0.3, 2.25, 0);
        group.add(crest);

        // Fanned Tail Feathers with Eyespot Jewels
        for (let i = -5; i <= 5; i++) {
          const angle = (i * Math.PI) / 14;
          const feather = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.06, 2.0, 8), this.getMaterial(0x059669, opts));
          feather.position.set(-0.8, 1.5, 0);
          feather.rotation.z = angle;
          group.add(feather);

          const eyeSpot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), goldMat);
          eyeSpot.position.set(-0.8 + Math.sin(angle) * 1.0, 1.5 + Math.cos(angle) * 1.0, 0.05);
          group.add(eyeSpot);
        }

        break;
      }
    }

    return group;
  }

  /**
   * Universal factory to build any monument by ID
   */
  public static buildMonument(monumentId: MonumentId, opts: ModelBuildOptions = {}): THREE.Group {
    switch (monumentId) {
      case 'taj-mahal':
        return this.buildTajMahal(opts);
      case 'konark-sun':
        return this.buildKonarkSun(opts);
      case 'meenakshi-amman':
        return this.buildMeenakshiAmman(opts);
      case 'kailasa-ellora':
        return this.buildKailasaEllora(opts);
      case 'hawa-mahal':
        return this.buildHawaMahal(opts);
      case 'hampi-chariot':
        return this.buildHampiChariot(opts);
      case 'qutub-minar':
        return this.buildQutubMinar(opts);
      case 'brihadisvara':
        return this.buildBrihadisvara(opts);
      case 'golden-temple':
        return this.buildGoldenTemple(opts);
      default:
        return this.buildTajMahal(opts);
    }
  }

  /**
   * Procedural 3D Model: Sri Harmandir Sahib (Golden Temple, Amritsar)
   * Includes Amrit Sarovar water basin, marble causeway, 4 cardinal open doors,
   * two-storey gold-plated sanctum, corner chhatris, and crowning ribbed gold dome.
   */
  public static buildGoldenTemple(opts: ModelBuildOptions = {}): THREE.Group {
    const group = new THREE.Group();
    group.name = 'GoldenTemple';

    const goldMat = this.getGoldMaterial(opts);
    const marbleMat = this.getMaterial(opts.reconstructionMode ? 0xffffff : 0xf1efe7, opts);
    const darkMat = this.getMaterial(0x1a1a24, opts);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });

    // 1. Holy Sarovar Water Pool (Large Blue Basin)
    const pool = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 8), waterMat);
    pool.position.y = 0.15;
    group.add(pool);

    // Marble Parikrama Outer Edge & Plinth
    const sarovarBorder = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.35, 8.4), marbleMat);
    sarovarBorder.position.y = 0.12;
    group.add(sarovarBorder);

    // 2. White Marble Causeway Bridge (Darshani Deori to Sanctum)
    const causeway = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.45, 3.8), marbleMat);
    causeway.position.set(0, 0.28, 2.1);
    group.add(causeway);

    // Bridge Railings
    const railingL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 3.8), goldMat);
    railingL.position.set(-0.55, 0.55, 2.1);
    group.add(railingL);

    const railingR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 3.8), goldMat);
    railingR.position.set(0.55, 0.55, 2.1);
    group.add(railingR);

    // 3. Central Marble Island Plinth
    const island = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.5, 4.2), marbleMat);
    island.position.y = 0.3;
    group.add(island);

    // 4. Ground Floor Sanctum (Marble Base with Inlay)
    const groundFloor = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.4, 3.2), marbleMat);
    groundFloor.position.y = 1.15;
    group.add(groundFloor);

    // Four Open Doorways (Universal Welcome on 4 Cardinal Directions)
    for (let i = 0; i < 4; i++) {
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.1, 0.2), darkMat);
      door.position.y = 1.05;
      door.rotation.y = (i * Math.PI) / 2;
      door.translateZ(1.52);
      group.add(door);

      // Gold Torana Arch over each door
      const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 0.22), goldMat);
      doorFrame.position.y = 1.65;
      doorFrame.rotation.y = (i * Math.PI) / 2;
      doorFrame.translateZ(1.52);
      group.add(doorFrame);
    }

    // 5. First Floor — Gleaming Pure 24K Gold Plating
    const goldFloor = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 3.0), goldMat);
    goldFloor.position.y = 2.45;
    group.add(goldFloor);

    // Decorative Golden Jali / Windows on Upper Floor
    for (let i = 0; i < 4; i++) {
      const windowCutout = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.1), darkMat);
      windowCutout.position.y = 2.45;
      windowCutout.rotation.y = (i * Math.PI) / 2;
      windowCutout.translateZ(1.46);
      group.add(windowCutout);
    }

    // Golden Cornice / Eaves (Chhajja)
    const chhajja = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.15, 3.4), goldMat);
    chhajja.position.y = 3.12;
    group.add(chhajja);

    // 6. Rooftop Golden Chhatris (4 Corner Domes)
    const cornerOffsets = [
      [-1.2, -1.2],
      [1.2, -1.2],
      [-1.2, 1.2],
      [1.2, 1.2],
    ];
    for (const [cx, cz] of cornerOffsets) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), goldMat);
      pillar.position.set(cx, 3.45, cz);
      group.add(pillar);

      const chhatriDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6),
        goldMat
      );
      chhatriDome.position.set(cx, 3.75, cz);
      group.add(chhatriDome);
    }

    // 7. Central Fluted Golden Dome (The Crown of Harmandir Sahib)
    const domeDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.4, 24), goldMat);
    domeDrum.position.y = 3.4;
    group.add(domeDrum);

    const mainDome = new THREE.Mesh(
      new THREE.SphereGeometry(1.05, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.7),
      goldMat
    );
    mainDome.scale.set(1.0, 1.2, 1.0);
    mainDome.position.y = 3.65;
    group.add(mainDome);

    // Golden Lotus Kalasha Finial
    const finial = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.75, 16), goldMat);
    finial.position.y = 4.95;
    group.add(finial);

    return group;
  }
}
