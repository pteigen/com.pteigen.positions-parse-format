import {utmZone} from "../utm"

test('utmzone 45 10', () => {
    expect(utmZone({lat: 45, lon: 10})).toBe("32T");
  });
  
  test('utmzone 60 5', () => {
    expect(utmZone({lat: 60, lon: 5})).toBe("32V");
  });
  
  
  test('utmzone 55 5', () => {
    expect(utmZone({lat: 55, lon: 5})).toBe("31U");
  });
  
  test('utmzone 80 8', () => {
    expect(utmZone({lat: 80, lon: 8})).toBe("31X");
  });
  
  test('utmzone 80 10', () => {
    expect(utmZone({lat: 80, lon: 10})).toBe("33X");
  });
  
  test('utmzone 80 29', () => {
    expect(utmZone({lat: 80, lon: 29})).toBe("35X");
  });
  
  
  test('utmzone 80 45', () => {
    expect(utmZone({lat: 80, lon: 45})).toBe("38X");
  });
  
    