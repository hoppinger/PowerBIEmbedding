using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PowerBIPoC.Models{
  public partial class PowerBIPoCContext {
    public DbSet<HomePage> HomePage { get; set; }
    public DbSet<Admin> Admin { get; set; }
    public DbSet<BIDiagram> BIDiagram { get; set; }
    
    
    
    
    
    // Authentication context
    public DbSet<Session> Session { get; set; }
    public DbSet<LoginAttempt> LoginAttempt { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder) {

      modelBuilder.Entity<Admin>()
              .HasIndex(b => b.Username)
              .IsUnique();
      modelBuilder.Entity<Admin>()
              .HasIndex(b => b.Email)
              .IsUnique();
      modelBuilder.Entity<Admin>()
              .Property(b => b.EmailConfirmed)
              .HasDefaultValue(true);



  
    
    

  
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.CookieName);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.LoggedEntityName);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.LoggedEntityId);
      modelBuilder.Entity<Session>()
        .HasIndex(b => b.CreatedAt);
      modelBuilder.Entity<LoginAttempt>()
        .HasKey(b => new {b.IpAddress, b.Email});
    }
  }
}
    