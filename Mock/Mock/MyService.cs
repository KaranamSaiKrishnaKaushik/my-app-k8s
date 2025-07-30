
using Mock2;

namespace GherkinHome.Services
{
    public interface IMyService
    {
        IEnumerable<MyEntity> GetAll();
    }

    public class MyService : IMyService
    {
        private readonly AppDbContext _context;

        public MyService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<MyEntity> GetAll()
        {
            return _context.MyEntities.ToList();
        }
    }
}