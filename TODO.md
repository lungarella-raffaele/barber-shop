# TODO

## Known Bugs

- [ ] Password recover not working (expired recover token);
- [ ] Overall testing of the whole application;
- [ ] Create a paginated reservations page;

---
- [ ] Find a nice rate limit pattern;
- [ ] Consistent error messages;
- [ ] Check `.toLowerCase().trim()` to emails in reservation.service;
- [ ] Schedule cleanup service;
- [ ] Test DB;
- [ ] Test Rate Limit;
- [x] Index should check pending and expire date;
- [x] Clean up user is not working;
- [x] Footer is not always on the bottom (in error pages too);
- [x] Inserire le informazioni della prenotazione nella mail;
- [x] Inserire le informazioni della prenotazione nella conferma prenotazione;
- [x] Schedule tabs do not work properly on mobile;
- [x] Create a set of utilities to populate DB;
- [x] Fix Hero page, maybe having an image behind the hero to center it better;
- [x] Schedule deletion and PUT;
- [x] Schedule handle user feedback;
- [x] Shutdowns must have a staff ID;
- [x] Sticky menu is not working properly;
- [x] Race condition in reservation creation (fixed with transactions);
- [x] Auth hook logic issues (fixed execution order);
- [x] Rate limiting on auth endpoints (login, signup, password recovery, reservations);

- [ ] Service Instantiation Anti-Pattern
**Problem**: Creating `new SomeService()` everywhere is inefficient and makes testing hard
**Solution**:
- Implement singleton pattern: `getUserService()`, `getReservationService()`
- Or use dependency injection container (tsyringe)
- Makes testing easier and more performant


- [ ] Injectable Database Connections
**Problem**: Services use global `db` import, preventing transaction usage across services
**Solution**:


- [ ] Missing Input Validation in Actions
**Problem**: Some form actions don't validate inputs (e.g., UUID format)
**Solution**: Add validation middleware or Zod schemas for all action inputs

- [ ] Improve Cookie Security
**Location**: `src/lib/server/auth.ts`
**Problem**: `deleteSessionTokenCookie()` should match security options from `setSessionTokenCookie()`
**Solution**: Add `httpOnly`, `secure`, `sameSite` to delete call

- [ ] Add Request Validation Middleware
**Improvement**: Centralized validation for common patterns (UUIDs, dates, email format)

- [ ] Type Safety Improvements
- Stricter types for form data handling
- Better typed cookie options
- More explicit return types

---

# Orario (Store Hours)
- Monday 2 PM – 7 PM
- Tuesday 9 AM – 1 PM / 2 PM – 6:30 PM
- Wednesday 9 AM – 1 PM / 2 PM – 6:30 PM
- Thursday 9 AM – 1 PM / 2 PM – 6:30 PM
- Friday 9 AM – 1 PM / 2 PM – 6:30 PM
- Saturday 10 AM – 3 PM
