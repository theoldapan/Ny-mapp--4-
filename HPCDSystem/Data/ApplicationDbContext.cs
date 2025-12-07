using HPCDSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HPCDSystem.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Member> Members { get; set; }
    public DbSet<Facility> Facilities { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
    public DbSet<MemberSubscription> MemberSubscriptions { get; set; }
public DbSet<GymClass> GymClasses { get; set; }
public DbSet<ClassRegistration> ClassRegistrations { get; set; }    

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure MemberSubscription relationships
        modelBuilder.Entity<MemberSubscription>()
            .HasOne(ms => ms.Member)
            .WithMany()
            .HasForeignKey(ms => ms.MemberId);

        modelBuilder.Entity<MemberSubscription>()
            .HasOne(ms => ms.Plan)
            .WithMany()
            .HasForeignKey(ms => ms.PlanId);

        // Configure ClassRegistration relationships
        modelBuilder.Entity<ClassRegistration>()
            .HasOne(cr => cr.GymClass)
            .WithMany()
            .HasForeignKey(cr => cr.ClassId);

        // Configure SubscriptionPlan Features as JSON
        modelBuilder.Entity<SubscriptionPlan>()
            .Property(s => s.Features)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            );
    }
}
